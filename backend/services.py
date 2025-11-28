import joblib
import numpy as np
import tensorflow as tf
from typing import Tuple, Any

# IMPORTANT FIX: Use absolute local imports (no leading dots)
from schemas import FertilizerInput, PredictionOutput

# --- Configuration ---
# CORRECT PATH: The path is relative to the 'backend' folder where the server is running.
FERTILIZER_MODEL_PATH = "models/fertilizer_prediction_bundle.joblib"
DISEASE_MODEL_PATH = "models/plant_disease_model.h5"

# --- Global Placeholders ---
# These will hold the loaded models and encoders
FERTILIZER_MODEL_BUNDLE = None
DISEASE_MODEL = None

def load_models() -> Tuple[Any, Any]:
    """
    Loads the Random Forest classifier bundle (model + encoders) and the
    TensorFlow/Keras disease detection model from disk.
    """
    global FERTILIZER_MODEL_BUNDLE, DISEASE_MODEL

    # 1. Load Fertilizer Model (Joblib/Scikit-learn)
    try:
        FERTILIZER_MODEL_BUNDLE = joblib.load(FERTILIZER_MODEL_PATH)
        print(f"INFO: Loaded fertilizer bundle from {FERTILIZER_MODEL_PATH}")
    except FileNotFoundError:
        print(f"ERROR: Fertilizer model file not found at {FERTILIZER_MODEL_PATH}")
        FERTILIZER_MODEL_BUNDLE = None
    except Exception as e:
        print(f"ERROR: Failed to load fertilizer model: {e}")
        FERTILIZER_MODEL_BUNDLE = None

    # 2. Load Disease Detection Model (H5/TensorFlow/Keras)
    try:
        # Suppress TensorFlow warnings during load
        import logging
        tf.get_logger().setLevel(logging.ERROR)
        
        # Load the Keras model
        DISEASE_MODEL = tf.keras.models.load_model(DISEASE_MODEL_PATH)
        print(f"INFO: Loaded disease detection model from {DISEASE_MODEL_PATH}")
    except FileNotFoundError:
        print(f"ERROR: Disease model file not found at {DISEASE_MODEL_PATH}")
        DISEASE_MODEL = None
    except Exception as e:
        print(f"ERROR: Failed to load disease model: {e}")
        DISEASE_MODEL = None

    return FERTILIZER_MODEL_BUNDLE, DISEASE_MODEL

def predict_fertilizer(features: list) -> dict:
    """
    Takes a list of features (e.g., [crop_name, pH, N, P, K]) and returns
    a prediction using the loaded model bundle.
    """
    if FERTILIZER_MODEL_BUNDLE is None:
        return {
            "fertilizer": "Model Error",
            "focus": "Please check backend logs. Fertilizer model not loaded."
        }

    try:
        model = FERTILIZER_MODEL_BUNDLE['model']
        crop_encoder = FERTILIZER_MODEL_BUNDLE['crop_encoder']
        fert_encoder = FERTILIZER_MODEL_BUNDLE['fert_encoder']

        # 1. Encode the categorical crop name
        crop_name = features[0]
        crop_encoded = crop_encoder.transform([[crop_name]])[0]

        # 2. Prepare the final feature array
        numerical_features = features[1:]
        final_features = [crop_encoded] + numerical_features
        input_data = np.array(final_features).reshape(1, -1)

        # 3. Predict the encoded fertilizer class
        prediction_encoded = model.predict(input_data)

        # 4. Decode the prediction back to a human-readable label
        fertilizer_label = fert_encoder.inverse_transform(prediction_encoded)[0]

        return {
            "fertilizer": fertilizer_label,
            "focus": f"Adjusting soil nutrients based on current pH ({features[1]}) is crucial."
        }

    except Exception as e:
        # If encoding or prediction fails (e.g., invalid crop name)
        print(f"Prediction Error: {e}")
        return {
            "fertilizer": "Prediction Failed",
            "focus": f"Input validation failed for features: {str(features[0])}. Check inputs."
        }