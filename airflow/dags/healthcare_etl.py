from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

default_args = {
    'owner': 'healthhub',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'healthcare_etl_pipeline',
    default_args=default_args,
    description='A simple ETL pipeline for healthcare data',
    schedule_interval=timedelta(days=1),
)

def extract_data():
    print("Extracting data from MySQL...")
    # Logic to read from MySQL using pandas or similar
    return "extracted_data"

def transform_data(ti):
    data = ti.xcom_pull(task_ids='extract_task')
    print(f"Transforming {data}...")
    # Logic to clean medical logs, normalize names, handle nulls
    return "transformed_data"

def load_data(ti):
    data = ti.xcom_pull(task_ids='transform_task')
    print(f"Loading {data} to MinIO (Data Lakehouse) in Parquet format...")
    # Logic to upload to S3/MinIO
    return "loaded_successfully"

extract_task = PythonOperator(
    task_id='extract_task',
    python_callable=extract_data,
    dag=dag,
)

transform_task = PythonOperator(
    task_id='transform_task',
    python_callable=transform_data,
    dag=dag,
)

load_task = PythonOperator(
    task_id='load_task',
    python_callable=load_data,
    dag=dag,
)

extract_task >> transform_task >> load_task
