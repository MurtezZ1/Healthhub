from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'healthhub-data-team',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

def extract_data(**kwargs):
    print("Extracting data from Healthhub MySQL Database...")
    # Logic to connect to MySQL and fetch data would go here
    return "raw_data.json"

def transform_data(**kwargs):
    ti = kwargs['ti']
    extracted_data = ti.xcom_pull(task_ids='extract')
    print(f"Transforming {extracted_data}...")
    # Logic to clean and aggregate data
    return "clean_data.json"

def load_data(**kwargs):
    ti = kwargs['ti']
    transformed_data = ti.xcom_pull(task_ids='transform')
    print(f"Loading {transformed_data} into Data Warehouse...")
    # Logic to insert into standard DB or Data Lake
    return "Success"

with DAG(
    'healthhub_etl_pipeline',
    default_args=default_args,
    description='A simple ETL pipeline for Healthhub analytics',
    schedule_interval=timedelta(days=1),
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=['etl', 'healthhub'],
) as dag:

    t1 = PythonOperator(
        task_id='extract',
        python_callable=extract_data,
    )

    t2 = PythonOperator(
        task_id='transform',
        python_callable=transform_data,
    )

    t3 = PythonOperator(
        task_id='load',
        python_callable=load_data,
    )

    t1 >> t2 >> t3
