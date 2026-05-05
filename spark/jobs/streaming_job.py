from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, StringType, BooleanType

# Initialize Spark Session for Structured Streaming
spark = SparkSession.builder \
    .appName("HealthhubMedicalStreaming") \
    .getOrCreate()

# Define the schema of the incoming Kafka JSON messages
schema = StructType() \
    .add("PatientId", StringType()) \
    .add("DeviceName", StringType()) \
    .add("ReadingValue", StringType()) \
    .add("IsCritical", BooleanType())

# Read streaming data from Kafka 'notifications' topic
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:29092") \
    .option("subscribe", "notifications") \
    .load()

# Convert the value column from Kafka into a string and parse JSON
parsed_df = df.selectExpr("CAST(value AS STRING)") \
    .select(from_json(col("value"), schema).alias("data")) \
    .select("data.*")

# Filter only critical readings for real-time alerting
critical_readings = parsed_df.filter(col("IsCritical") == True)

# Output the critical readings to the console (can be changed to write to MongoDB or MinIO)
query = critical_readings \
    .writeStream \
    .outputMode("append") \
    .format("console") \
    .start()

query.awaitTermination()
