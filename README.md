# MedHelpTG

## Project Overview

Wound classification system using classical machine learning (MobileNetV2 features + Logistic Regression) for medical image analysis.

## Setup

### Python Backend (ML Model)

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Train the model:
```bash
python train_model.py
```

4. Run the Flask web app:
```bash
python app.py
```

The app will be available at `http://localhost:5001`

### Frontend (React/TypeScript)

If you have a frontend component:

```bash
npm install
npm run dev
```

## Project Structure

- `train_model.py` - Training script for the wound classifier
- `app.py` - Flask backend API
- `evaluate_model.py` - Standalone evaluation script
- `Wound_dataset/` - Training dataset (not tracked in git)
- `templates/` - Flask HTML templates

## Technologies

**Backend:**
- Python
- TensorFlow/Keras (MobileNetV2 for feature extraction)
- scikit-learn (Logistic Regression classifier)
- Flask

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Model Information

The model uses:
- **Feature Extractor**: MobileNetV2 (frozen, ImageNet weights)
- **Classifier**: Logistic Regression with class balancing
- **Classes**: 10 wound types (Abrasions, Bruises, Burns, Cut, Diabetic Wounds, Laceration, Normal, Pressure Wounds, Surgical Wounds, Venous Wounds)

## Deployment

The Flask backend can be deployed to any Python hosting service. The React frontend can be deployed via Lovable or any static hosting service.
