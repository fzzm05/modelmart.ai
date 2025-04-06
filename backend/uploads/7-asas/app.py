# app.py

from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np
import json

# Load the trained model
model_path = 'model.pkl'
with open(model_path, 'rb') as file:
    model = pickle.load(file)

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Demo data for testing
    demo_features = {
        'IQ': 100,
        'CGPA': 8.8,
        '10th_Marks': 90,
        '12th_Marks': 90,
        'Communication_Skills': 5
    }
    
    # Convert demo features to numpy array
    features = np.array(list(demo_features.values())).reshape(1, -1)
    feature_names = list(demo_features.keys())
    
    # Make prediction
    prediction = model.predict(features)
    output = 'Placed' if prediction[0] == 1 else 'Not Placed'
    
    # Return prediction with demo features
    return jsonify({
        "prediction": output,
        "input_features": dict(zip(feature_names, features[0]))
    })

if __name__ == "__main__":
    app.run(debug=True)
