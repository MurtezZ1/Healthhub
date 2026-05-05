import os
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd
import numpy as np

def train_predictive_model():
    print("Connecting to MLflow server...")
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("Patient_Risk_Prediction")
    
    # Generate mock healthcare data (since we don't have a real medical dataset exported yet)
    # Features: Age, BloodPressure, HeartRate, Cholesterol
    # Target: HighRisk (1) or LowRisk (0)
    np.random.seed(42)
    data_size = 1000
    X = pd.DataFrame({
        'Age': np.random.randint(18, 90, data_size),
        'BloodPressure': np.random.randint(90, 180, data_size),
        'HeartRate': np.random.randint(60, 120, data_size),
        'Cholesterol': np.random.randint(150, 300, data_size)
    })
    
    # Rule to generate target: high values increase probability of HighRisk
    risk_score = (X['Age'] * 0.3) + (X['BloodPressure'] * 0.4) + (X['Cholesterol'] * 0.3)
    y = (risk_score > risk_score.median()).astype(int)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    with mlflow.start_run():
        n_estimators = 100
        max_depth = 5
        
        # Log hyperparameters
        mlflow.log_param("n_estimators", n_estimators)
        mlflow.log_param("max_depth", max_depth)
        
        # Train model
        print("Training Random Forest model for risk prediction...")
        model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        
        # Log metrics
        mlflow.log_metric("accuracy", accuracy)
        print(f"Model accuracy: {accuracy:.2f}")
        
        # Log model
        mlflow.sklearn.log_model(model, "random_forest_model")
        print("Model successfully saved to MLflow registry!")

if __name__ == "__main__":
    train_predictive_model()
