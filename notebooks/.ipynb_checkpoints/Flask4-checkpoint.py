from flask import Flask, jsonify
from confluent_kafka import Consumer, KafkaError
import threading
import json
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

bootstrap_server = "kafka:9092"
topic = "hwinfo_logs_RT"

consumer_config = {
    "bootstrap.servers": bootstrap_server,
    "group.id": "flask-consumer-group",
    "auto.offset.reset": "latest",  # Change to 'latest' if you only want new messages
}

consumer = Consumer(consumer_config)

message_buffer = []
MAX_BUFFER_SIZE = 10
buffer_lock = threading.Lock()  # Lock for thread safety

def consume_kafka_messages():
    global message_buffer
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(2.0)  # Increase poll timeout to reduce CPU usage
        if msg is None:
            time.sleep(0.5)  # Prevent unnecessary tight looping
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(f"Kafka error: {msg.error()}")
                break

        message = msg.value().decode("utf-8")
        data = json.loads(message)

        with buffer_lock:  # Ensure thread-safe access to the message buffer
            message_buffer.append(data)
            if len(message_buffer) > MAX_BUFFER_SIZE:
                message_buffer.pop(0)

kafka_thread = threading.Thread(target=consume_kafka_messages, daemon=True)
kafka_thread.start()

@app.route("/home")
def home():
    return {"message": "Flask API operational"}

@app.route("/dashboard", methods=["GET"])
def get_logs():
    with buffer_lock:  # Ensure safe access when Flask reads data
        return jsonify(message_buffer)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
