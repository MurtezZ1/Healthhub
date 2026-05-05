import json
import time
from confluent_kafka import Consumer, KafkaError

def send_push_notification(patient_id, device, reading, is_critical):
    """Simulates sending a push notification/webhook to a doctor's phone/dashboard."""
    if is_critical:
        print("\n" + "="*50)
        print("🚨 CRITICAL ALERT - PUSH NOTIFICATION DISPATCHED 🚨")
        print(f"To: Dr. Smith (On-Call)")
        print(f"Patient ID: {patient_id}")
        print(f"Device: {device}")
        print(f"Reading: {reading} (ABNORMAL)")
        print("="*50 + "\n")
    else:
        print(f"[INFO] Normal reading received for patient {patient_id}. No alert triggered.")

def start_event_driven_listener():
    print("Starting Event-Driven Notification Service...")
    
    # Configure Kafka Consumer
    conf = {
        'bootstrap.servers': 'localhost:29092',  # Connect to the local Kafka broker
        'group.id': 'notification_service_group',
        'auto.offset.reset': 'latest'
    }
    
    consumer = Consumer(conf)
    consumer.subscribe(['notifications'])
    
    print("Listening for health events on 'notifications' topic...\n")
    
    try:
        # For demonstration, we'll simulate a loop. 
        # In reality, this runs infinitely.
        while True:
            # We use a timeout to avoid blocking forever in this test script
            msg = consumer.poll(timeout=2.0)
            
            if msg is None:
                # Simulate a new message arriving (since the backend might not be sending them right now)
                print("Simulating incoming Kafka Event...")
                mock_event = {
                    "PatientId": "P-9991",
                    "DeviceName": "Heart Monitor",
                    "ReadingValue": "210 BPM",
                    "IsCritical": True
                }
                send_push_notification(
                    mock_event["PatientId"], 
                    mock_event["DeviceName"], 
                    mock_event["ReadingValue"], 
                    mock_event["IsCritical"]
                )
                time.sleep(5)
                continue
                
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    break
            
            # Real message processing
            event_data = json.loads(msg.value().decode('utf-8'))
            send_push_notification(
                event_data.get("PatientId"),
                event_data.get("DeviceName"),
                event_data.get("ReadingValue"),
                event_data.get("IsCritical", False)
            )
            
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()

if __name__ == "__main__":
    start_event_driven_listener()
