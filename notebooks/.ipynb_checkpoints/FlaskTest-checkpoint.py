from flask import Flask
from confluent_kafka import Consumer, KafkaException
import json

app = Flask(__name__)

@app.route('/')
def home():
    return {"message": "you sure this shit works?"}

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)