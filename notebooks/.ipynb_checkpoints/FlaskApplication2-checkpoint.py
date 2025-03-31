from flask import Flask, jsonify
from confluent_kafka import Consumer, KafkaException

app = Flask(__name__)

bootstrap_server = "kafka:9092"
topic = "hwinfo_logs_RT"

consumer = Consumer({
    'bootstrap.servers': bootstrap_server,
    'group.id': 'flask-consumer-group',
    'auto.offset.reset': 'latest'
})

consumer.subscribe([topic])

@app.route('/home', methods = ['GET'])
def home():
    return {"message": "checking to see if this garbage works or not"}

@app.route('/logs', methods = ['GET'])
def get_updates():
    try:
        msg = consumer.poll(1.0)
        if msg is None:
            return jsonify({"message": "brother nothing brother"}), 204
        if msg.error():
            raise KafkaExcpetion(msg.error())
        
        return jsonify({"latest_data": msg.value().decode('utf-8')}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)

        
