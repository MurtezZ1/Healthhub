import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from mlxtend.frequent_patterns import apriori, association_rules

def run_clustering():
    print("--- Running K-Means Clustering ---")
    # Simulate patient health metrics
    np.random.seed(42)
    data_size = 500
    df = pd.DataFrame({
        'Age': np.random.randint(18, 90, data_size),
        'BMI': np.random.uniform(18.5, 40.0, data_size),
        'BloodSugar': np.random.randint(70, 200, data_size)
    })
    
    # Apply K-Means
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['Cluster'] = kmeans.fit_predict(df)
    
    print("Identified 3 Patient Clusters (e.g., Healthy, At-Risk, Critical):")
    print(df.groupby('Cluster').mean().round(2))
    print("---------------------------------\n")

def run_association_rules():
    print("--- Running Association Rule Mining (Apriori) ---")
    # Simulate transaction data (which medical services are bought/used together)
    # Items: BloodTest, EKG, XRay, MRI
    transactions = [
        ['BloodTest', 'EKG'],
        ['BloodTest', 'XRay', 'EKG'],
        ['MRI', 'XRay'],
        ['BloodTest', 'EKG'],
        ['BloodTest', 'XRay'],
        ['BloodTest', 'EKG', 'MRI']
    ]
    
    # Convert list to DataFrame format required by mlxtend
    from mlxtend.preprocessing import TransactionEncoder
    te = TransactionEncoder()
    te_ary = te.fit(transactions).transform(transactions)
    df = pd.DataFrame(te_ary, columns=te.columns_)
    
    # Find frequent itemsets
    frequent_itemsets = apriori(df, min_support=0.3, use_colnames=True)
    
    # Generate association rules
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.6)
    
    print("Discovered Medical Dependencies:")
    for _, row in rules.iterrows():
        antecedents = ", ".join(list(row['antecedents']))
        consequents = ", ".join(list(row['consequents']))
        confidence = row['confidence'] * 100
        print(f"Rule: If a patient gets {antecedents}, there is a {confidence:.1f}% chance they also need {consequents}.")
    print("---------------------------------\n")

if __name__ == "__main__":
    run_clustering()
    run_association_rules()
