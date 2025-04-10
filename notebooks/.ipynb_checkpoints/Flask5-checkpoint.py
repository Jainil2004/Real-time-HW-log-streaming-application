from flask import Flask, jsonify, request
from confluent_kafka import Consumer, KafkaError
import threading
import json
import time
from flask_cors import CORS
from elasticsearch import Elasticsearch

app = Flask(__name__)
CORS(app)

# kafka listen topic at the given bootstrap-server 
bootstrap_server = "kafka:9092"
topic = "hwinfo_logs_RT"

# kafka configure the damn consumer to listen to messages sent by spark on the RT stream
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

# Elasticsearch configuration
es = Elasticsearch(hosts=["http://elasticsearch:9200"])
es_index = "hwinfo_test"

# Mapping of div IDs to Elasticsearch query conditions
anomaly_conditions = {
    "coreThermalThrottling": {
        "field": "Core_Thermal_Throttling",
        "condition": {"term": {"Core_Thermal_Throttling": 1}}
    },
    "distanceToTjMAX": {
        "field": "Core_Distance_to_TjMAX_avg_C",
        "condition": {"range": {"Core_Distance_to_TjMAX_avg_C": {"lt": 85}}}
    },
    "highPackagePower": {
        "field": "CPU_Package_Power_W",
        "condition": {"range": {"CPU_Package_Power_W": {"gt": 90}}}
    },
    "highCoreActivity": {
        "field": "Core_Usage_avg_percent",
        "condition": {"range": {"Core_Usage_avg_percent": {"gt": 90}}}
    }
}

@app.route("/search", methods=["POST"])
def search_anomaly():
    data = request.json
    anomaly = data.get("anomaly")

    if not anomaly or anomaly not in anomaly_conditions:
        return jsonify({"error": "Invalid or missing anomaly condition"}), 400

    # Get the condition for the selected anomaly
    condition = anomaly_conditions[anomaly]["condition"]

    # Construct the Elasticsearch query
    query = {
        "query": condition
    }

    try:
        response = es.search(index=es_index, body=query)
        results = [hit["_source"] for hit in response["hits"]["hits"]]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/home")
def home():
    return {"message": "Flask API operational"}

@app.route("/dashboard", methods=["GET"])
def get_logs():
    with buffer_lock:  # Ensure safe access when Flask reads data
        return jsonify(message_buffer)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
