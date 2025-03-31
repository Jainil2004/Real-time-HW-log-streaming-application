from flask import Flask, jsonify
from confluent_kafka import Consumer, KafkaException, KafkaError
import threading
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

bootstrap_server = "kafka:9092"
topic = "hwinfo_logs_RT"

consumer_config = {
    "bootstrap.servers": bootstrap_server,
    "group.id": "flask-consumer-group",
    "auto.offset.reset": "latest"
}

consumer = Consumer(consumer_config)

message_buffer = []
MAX_BUFFER_SIZE = 10

def consume_kafka_messages():
    global message_buffer
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(f"kafka error: {msg.error()}")
                break
        message = msg.value().decode("utf-8")

        message_buffer.append(json.loads(message))
        if len(message_buffer) > MAX_BUFFER_SIZE:
            message_buffer.pop(0)

kafka_thread = threading.Thread(target=consume_kafka_messages, daemon=True)
kafka_thread.start()

@app.route("/home")
def home():
    return {"message" : "flask API operational"}

@app.route("/dashboard", methods =["GET"])
def get_logs():
    return jsonify(message_buffer)

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True) 