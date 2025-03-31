from flask import Flask, jsonify
from confluent_kafka import Consumer, KafkaException
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

mock_data = [
    {
        "CPU_Package_C": 48.0,
        "CPU_Package_Power_W": 31.748,
        "Core_Clocks_avg_MHz": 3038.4,
        "Core_Temperatures_avg_C": 44.0,
        "Core_Usage_avg_percent": 6.2,
        "Date": "20.3.2025",
        "Ring_LLC_Clock_MHz": 3790.7,
        "Time": "22:54:44.959"
    },
    {
        "CPU_Package_C": 50.0,
        "CPU_Package_Power_W": 41.003,
        "Core_Clocks_avg_MHz": 4085.8,
        "Core_Temperatures_avg_C": 45.0,
        "Core_Usage_avg_percent": 5.3,
        "Date": "20.3.2025",
        "Ring_LLC_Clock_MHz": 4588.8,
        "Time": "22:54:46.088"
    }
]

@app.route("/home")
def home():
    return {"message": "shit is working properly @ flask test 3 "}

@app.route('/dashboard', methods=['GET'])
def get_data():
    return jsonify(mock_data)  # Return mock data for now

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
