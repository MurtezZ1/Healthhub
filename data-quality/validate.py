import great_expectations as ge

def validate_medical_data():
    print("Initializing Great Expectations for Data Quality Validation...")
    
    # Normally this would read from MySQL, MinIO, or a Spark DataFrame
    # Using a dummy pandas dataframe for demonstration of rules
    import pandas as pd
    
    data = {
        "PatientId": ["P001", "P002", "P003", None],
        "Age": [45, -5, 30, 80], # -5 is invalid
        "HeartRate": [75, 80, 200, 60] # 200 might be out of normal range
    }
    
    df = pd.DataFrame(data)
    ge_df = ge.from_pandas(df)
    
    # Define Data Quality Rules (Expectations)
    
    # 1. PatientId should never be null
    result_1 = ge_df.expect_column_values_to_not_be_null("PatientId")
    print(f"Expectation 1 (No Null PatientId): {'Passed' if result_1.success else 'Failed'}")
    
    # 2. Age must be between 0 and 120
    result_2 = ge_df.expect_column_values_to_be_between("Age", min_value=0, max_value=120)
    print(f"Expectation 2 (Valid Age): {'Passed' if result_2.success else 'Failed'}")
    
    # 3. Heart Rate should be in a reasonable range
    result_3 = ge_df.expect_column_values_to_be_between("HeartRate", min_value=30, max_value=180)
    print(f"Expectation 3 (Valid Heart Rate): {'Passed' if result_3.success else 'Failed'}")
    
    print("\nData Quality Validation Complete.")

if __name__ == "__main__":
    validate_medical_data()
