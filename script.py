import telebot
from telebot import types
from collections import Counter, defaultdict
import google.generativeai as genai
import json
import os

GENAI_KEY = "Gemini_API"
model = genai.GenerativeModel("Gemeni_Ver")
bot = telebot.TeleBot('TELEGRAMBOT_TOKEN')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SYMPTOM_CONFIG_PATH = os.path.join(BASE_DIR, "symptoms_config.json")
FACILITY_PATH = os.path.join(BASE_DIR, "facilities.json")

with open(SYMPTOM_CONFIG_PATH, "r", encoding="utf-8") as f:
    RAW_SYMPTOM_CONFIG = json.load(f)

CATEGORY_CONFIG = RAW_SYMPTOM_CONFIG["categories"]
SYMPTOM_CONFIG = RAW_SYMPTOM_CONFIG["symptoms"]

SYMPTOMS = {name: cfg["label"] for name, cfg in SYMPTOM_CONFIG.items()}
SYMPTOM_FLOWS = {
    name: [
        (step["field_id"], step["question"], step["options"])
        for step in cfg.get("flow", [])
    ]
    for name, cfg in SYMPTOM_CONFIG.items()
}

with open(FACILITY_PATH, "r", encoding="utf-8") as f:
    FACILITY_DATA = json.load(f)

user_symptoms: dict[int, Counter] = defaultdict(Counter)
user_state: dict[int, dict] = {}

last_bot_msg: dict[int, int] = {}


# ------------- STATE AND MESSAGE HELPERS -------------

def get_state(chat_id: int) -> dict:
    if chat_id not in user_state:
        user_state[chat_id] = {
            "details": {},
            "current": None,   # current symptom
            "category": None   # current system group
        }
    return user_state[chat_id]


def safe_delete(chat_id: int, message_id: int) -> None:
    try:
        bot.delete_message(chat_id, message_id)
    except Exception:
        pass


def send_clean_message(chat_id: int, text: str, **kwargs):
    """
    Send a scripted bot message and delete the previous scripted one:
    used for questions and short prompts. Do not use for messages that
    carry the main reply keyboard or for final AI results.
    """
    old_id = last_bot_msg.get(chat_id)
    if old_id is not None:
        safe_delete(chat_id, old_id)

    msg = bot.send_message(chat_id, text, **kwargs)
    last_bot_msg[chat_id] = msg.message_id
    return msg


# ------------- AI FUNCTIONS -------------

def medlm_summary(symptoms, details):
    prompt = f"""
User symptoms: {symptoms}
Symptom details: {details}

Provide a concise, safe triage summary:
- possible explanations (NOT a diagnosis)
- write EXACTLY one line starting with:
  Severity: self-care
  OR
  Severity: urgent care
  OR
  Severity: ER
  OR
  Severity: Trauma center
  OR
  Severity: Appointment with provider
- red flags to watch for
- under 70 words
- no medications
- do not use any "*" when answering
- use common words, less medical terms, make it very easy to comprehend
"""
    try:
        response = model.generate_content(prompt)
        return (response.text or "").strip()
    except Exception:
        return "I could not create a summary."


def gemini_chat_reply(user_text, counts=None, details=None):
    counts = counts or Counter()
    details = details or {}

    prompt = f"""
Context:
Symptoms selected: {list(counts.elements())}
Details: {details}

User message: "{user_text}"

Reply under 70 words.
Do not diagnose or give medication.
Use simple language.
You may remind the user that this is not medical advice.
"""

    try:
        resp = model.generate_content(prompt)
        return (resp.text or "").strip() or "I could not respond."
    except Exception:
        return "I could not respond."


def extract_urgency_from_summary(summary: str) -> str:
    """
    Map Severity line to one of:
    "urgent", "er", "trauma", "appointment", "".
    """

    severity_value = ""

    for raw in summary.splitlines():
        line = raw.strip()
        if line.lower().startswith("severity:"):
            severity_value = line.split(":", 1)[1].strip().lower()
            break

    if not severity_value:
        return ""

    # appointment must be checked before anything with "er"
    if severity_value.startswith("appointment with provider"):
        return "appointment"

    if severity_value.startswith("urgent care"):
        return "urgent"

    # strict ER checks so "provider" does not match "er"
    if severity_value == "er":
        return "er"
    if "emergency room" in severity_value:
        return "er"

    if severity_value.startswith("trauma center") or "trauma" in severity_value:
        return "trauma"

    # self-care or unknown: no facilities
    return ""


# ------------- FACILITIES -------------

def build_facility_message(category: str) -> str:
    data = FACILITY_DATA.get(category)
    if not data:
        return ""

    if category == "urgent":
        header = "Based on severity, you may need an urgent care clinic. Here are options in Philadelphia:\n\n"
    elif category == "er":
        header = "Based on severity, you may need an emergency room. Here are nearby ER options:\n\n"
    elif category == "trauma":
        header = "Based on severity, a trauma center may be appropriate. Here are nearby trauma centers:\n\n"
    elif category == "appointment":
        header = "Based on severity, you may only need a primary care appointment. Here are some options:\n\n"
    else:
        header = ""

    lines = []
    for place in data:
        lines.append(
            f"- {place['name']} ({place['address']}). Hours: {place['hours']}\n  Location: {place['map_url']}"
        )

    body = "\n".join(lines)
    return header + body + "\n\nIf you ever feel in danger, call 911."

# ------------- FOLLOW UP QUESTIONS -------------

def ask_next_detail(chat_id: int, symptom: str) -> None:
    state = get_state(chat_id)
    details = state["details"].setdefault(symptom, {})

    flow = SYMPTOM_FLOWS.get(symptom, [])

    if not flow:
        user_symptoms[chat_id][symptom] += 1
        send_clean_message(chat_id, f"Saved {symptom}. You can select another symptom or press Finish.")
        state["current"] = None
        return

    answered = set(details.keys())
    next_step = None
    for field_id, question, options in flow:
        if field_id not in answered:
            next_step = (field_id, question, options)
            break

    if not next_step:
        user_symptoms[chat_id][symptom] += 1
        send_clean_message(
            chat_id,
            f"Saved {symptom}. Choose another symptom or press Finish."
        )
        state["current"] = None
        return

    field_id, question, options = next_step
    keyboard = types.InlineKeyboardMarkup()
    for label, value in options:
        cb_data = f"detail|{symptom}|{field_id}|{value}"
        keyboard.add(types.InlineKeyboardButton(label, callback_data=cb_data))

    state["current"] = symptom
    send_clean_message(chat_id, question, reply_markup=keyboard)


@bot.callback_query_handler(func=lambda c: c.data.startswith("detail|"))
def handle_detail_callback(call):
    chat_id = call.message.chat.id
    parts = call.data.split("|")
    if len(parts) != 4:
        bot.answer_callback_query(call.id)
        return

    _, symptom, field_id, value = parts

    state = get_state(chat_id)
    details = state["details"].setdefault(symptom, {})
    details[field_id] = value

    bot.answer_callback_query(call.id)
    ask_next_detail(chat_id, symptom)


# ------------- SYSTEM -> SYMPTOM DROPDOWN -------------

@bot.callback_query_handler(func=lambda c: c.data.startswith("symcat|") or c.data == "symcat_back")
def handle_symptom_category_callback(call):
    chat_id = call.message.chat.id
    data = call.data

    if data == "symcat_back":
        state = get_state(chat_id)
        state["category"] = None
        # remove dropdown message only
        safe_delete(chat_id, call.message.message_id)
        bot.answer_callback_query(call.id)
        return

    # symptom from dropdown
    _, symptom_name = data.split("|", 1)
    symptom_name = symptom_name.strip()

    if symptom_name in SYMPTOMS:
        bot.answer_callback_query(call.id)
        state = get_state(chat_id)
        state["current"] = symptom_name
        # go straight to follow up questions
        ask_next_detail(chat_id, symptom_name)
    else:
        bot.answer_callback_query(call.id, text="Unknown symptom")


# ------------- COMMAND HANDLERS -------------

@bot.message_handler(commands=["start"])
def start(message):
    chat_id = message.chat.id

    systems = list(CATEGORY_CONFIG.keys())

    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)

    # 2 systems per row
    row = []
    for i, name in enumerate(systems, start=1):
        row.append(types.KeyboardButton(name))
        if i % 2 == 0:
            markup.add(*row)
            row = []
    if row:
        markup.add(*row)

    # last row is Finish
    markup.add(types.KeyboardButton("Finish"))

    user_symptoms[chat_id].clear()
    user_state.pop(chat_id, None)
    last_bot_msg.pop(chat_id, None)

    bot.send_message(
        chat_id,
        f"Hello {message.from_user.first_name}\nFirst choose a body system in the bottom menu. Then pick symptoms. Press Finish when done.",
        reply_markup=markup,
    )

    safe_delete(chat_id, message.message_id)


@bot.message_handler(commands=["help", "reset"])
def help_or_reset(message):
    chat_id = message.chat.id

    if message.text == "/help":
        send_clean_message(
            chat_id,
            "This tool helps you think about symptom urgency. It does not give a medical diagnosis. Use /start to begin."
        )
        safe_delete(chat_id, message.message_id)
        return

    if message.text == "/reset":
        user_symptoms[chat_id].clear()
        user_state.pop(chat_id, None)
        last_bot_msg.pop(chat_id, None)
        send_clean_message(chat_id, "Reset complete. Use /start to begin again.")
        safe_delete(chat_id, message.message_id)
        return


# ------------- MAIN MESSAGE HANDLER -------------

@bot.message_handler(func=lambda msg: True)
def handle_message(message):
    chat_id = message.chat.id
    text = message.text

    # system selected from bottom menu
    if text in CATEGORY_CONFIG:
        state = get_state(chat_id)
        state["category"] = text

        keyboard = types.InlineKeyboardMarkup()
        symptom_names = CATEGORY_CONFIG[text]

        for i in range(0, len(symptom_names), 2):
            row = []
            for name in symptom_names[i:i + 2]:
                cb_data = f"symcat|{name}"
                row.append(types.InlineKeyboardButton(name, callback_data=cb_data))
            keyboard.row(*row)

        keyboard.add(types.InlineKeyboardButton("Back", callback_data="symcat_back"))

        send_clean_message(
            chat_id,
            f"{text}: choose a symptom below.",
            reply_markup=keyboard,
        )

        safe_delete(chat_id, message.message_id)
        return

    # finish pressed
    if text in ("Finish", "/finish", "/Finish"):
        counts = user_symptoms[chat_id]
        details = user_state.get(chat_id, {}).get("details", {})

        thinking_msg = send_clean_message(chat_id, "Thinking...")

        try:
            ai_text = medlm_summary(
                symptoms=list(counts.elements()),
                details=details
            )
        finally:
            safe_delete(chat_id, thinking_msg.message_id)

        # final text should stay
        bot.send_message(chat_id, ai_text)

        category = extract_urgency_from_summary(ai_text)
        facility_msg = build_facility_message(category)
        if facility_msg:
            bot.send_message(chat_id, facility_msg)

        user_symptoms[chat_id].clear()
        user_state.pop(chat_id, None)
        last_bot_msg.pop(chat_id, None)

        safe_delete(chat_id, message.message_id)
        return

    # user typed a symptom name directly
    if text in SYMPTOMS:
        state = get_state(chat_id)
        state["current"] = text
        ask_next_detail(chat_id, text)
        safe_delete(chat_id, message.message_id)
        return

    # free text -> Gemini
    counts = user_symptoms[chat_id]
    details = user_state.get(chat_id, {}).get("details", {})

    thinking = bot.send_message(chat_id, "Thinking...")
    try:
        reply = gemini_chat_reply(text, counts, details)
    finally:
        safe_delete(chat_id, thinking.message_id)

    # keep AI chat replies
    bot.send_message(chat_id, reply)


bot.infinity_polling()
