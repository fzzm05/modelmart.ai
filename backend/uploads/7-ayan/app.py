# app.py

import pickle
import numpy as np
import os
import json
import sys
import pandas as pd

# Get the directory where app.py is located
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model.pkl')

with open(model_path, 'rb') as file:
    model = pickle.load(file)

# Define the expected feature names in the correct order
FEATURE_NAMES = ['IQ', 'CGPA', '10th_Marks', '12th_Marks', 'Communication_Skills']

def make_prediction(input_data):
    try:
        # Create a pandas DataFrame with proper feature names
        features = pd.DataFrame([input_data], columns=FEATURE_NAMES)
        
        # Make prediction
        prediction = model.predict(features)
        output = 'Placed' if prediction[0] == 1 else 'Not Placed'
        
        return {
            "prediction": output,
            "input_features": input_data
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Read input from command line argument
    input_json = sys.argv[1]
    try:
        # Parse the input JSON
        data = json.loads(input_json)
        result = make_prediction(data)
        print(json.dumps(result))
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
