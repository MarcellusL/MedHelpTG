"""
Flask web application for wound image classification.
Demo front-end for testing the wound detection model.
"""

import os
import pickle
import numpy as np
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
from joblib import load as joblib_load
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load model and class names
MODEL_PATH = 'wound_classifier.joblib'
CLASS_NAMES_PATH = 'class_names.pkl'
IMG_SIZE = (224, 224)  # Keep in sync with training script

model = None
class_names = None
feature_extractor = None

def load_model():
    """Load the trained scikit-learn classifier and MobileNet backbone."""
    global model, class_names, feature_extractor

    if not (os.path.exists(MODEL_PATH) and os.path.exists(CLASS_NAMES_PATH)):
        print("Model files not found. Please train the classifier first.")
        return False

    try:
        print(f"Loading classifier from {MODEL_PATH}...")
        model = joblib_load(MODEL_PATH)

        with open(CLASS_NAMES_PATH, 'rb') as f:
            class_names = pickle.load(f)

        feature_extractor = MobileNetV2(
            input_shape=(*IMG_SIZE, 3),
            include_top=False,
            pooling='avg',
            weights='imagenet'
        )
        feature_extractor.trainable = False

        print(f"Classifier loaded. Classes: {class_names}")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
        feature_extractor = None
        return False

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def preprocess_image(image_path):
    """Preprocess image for model prediction."""
    img = Image.open(image_path)
    img = img.convert('RGB')
    img = img.resize(IMG_SIZE)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_image(image_path):
    """Predict wound type from image."""
    if model is None or feature_extractor is None:
        return None, "Model not loaded. Please train the model first."
    
    try:
        # Preprocess image
        img_array = preprocess_image(image_path)
        img_array = preprocess_input(img_array.copy())
        
        # Extract features
        features = feature_extractor.predict(img_array, verbose=0)
        
        # Scikit-learn prediction
        predictions = model.predict_proba(features)[0]
        predicted_class_idx = int(np.argmax(predictions))
        confidence = float(predictions[predicted_class_idx])
        predicted_class = class_names[predicted_class_idx]
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions)[-3:][::-1]
        top_3_predictions = [
            {
                'class': class_names[idx],
                'confidence': float(predictions[idx])
            }
            for idx in top_3_indices
        ]
        
        return {
            'predicted_class': predicted_class,
            'confidence': confidence,
            'top_3': top_3_predictions
        }, None
    except Exception as e:
        return None, str(e)

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and prediction."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload a JPG, PNG, or GIF image.'}), 400
    
    if model is None or feature_extractor is None:
        return jsonify({'error': 'Model not loaded. Please train the model first.'}), 500
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Make prediction
        result, error = predict_image(filepath)
        
        # Clean up uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        if error:
            return jsonify({'error': error}), 500
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    """Health check endpoint."""
    model_loaded = model is not None and feature_extractor is not None
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'classes': list(class_names) if class_names is not None else None
    })

if __name__ == '__main__':
    # Load model on startup
    load_model()
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5001)

