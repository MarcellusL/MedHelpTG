"""
Chat handler for web API - uses Gemini AI (similar to script.py).
"""
import os
import google.generativeai as genai
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(BASE_DIR), ".env"))

GENAI_KEY = os.getenv("GEMINI_API_KEY")
_model = None


def _get_model():
    global _model
    if _model is None and GENAI_KEY:
        genai.configure(api_key=GENAI_KEY)
        _model = genai.GenerativeModel("models/gemini-2.5-pro")
    return _model


def chat_with_context(messages):
    """
    Take a list of message dicts [{role: 'user'|'assistant', content: str}, ...]
    and return the assistant's reply.
    """
    model = _get_model()
    if not model:
        return (
            "Chat service is not configured. Set GEMINI_API_KEY in your .env file."
        )

    # Build prompt from message history
    prompt_parts = []
    for m in messages:
        role = (m.get("role") or "user").lower()
        content = (m.get("content") or "").strip()
        if not content:
            continue
        prefix = "User:" if role == "user" else "Assistant:"
        prompt_parts.append(f"{prefix} {content}")

    if not prompt_parts:
        return "Please send a message."

    prompt_parts.append("Assistant:")
    prompt = "\n\n".join(prompt_parts)

    try:
        response = model.generate_content(prompt)
        return (response.text or "").strip() or "I could not generate a response."
    except Exception as e:
        return f"I encountered an error: {str(e)}"
