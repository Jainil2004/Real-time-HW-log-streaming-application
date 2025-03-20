# Real time HW log streaming application
 previously known as 'spark_kafka_ES'. it is a integration setup for my flagship big data project. the setup contains everything required to get kafka, spark and ES working together with more additions on the way. 

how to use?
1. just run docker-compose and everything will function. though you will need to manually start producers for kafka. this does require WSL2 for windows
2. for getting the streaming to work. you would first require hwinfo with logging enabled. make sure the csv file is saved as 'test1.csv'
3. next start the 'kafkaTwoWayStreaming.ipynb' inside the docker jupyter container. this will start streaming from the file.
4. start the 'sparkKafkaESHwinfoTwoWayStreamingApplication.ipynb'. this will start spark and would stream the data to two destinations.
5. destionation 1: Elasticsearch under the index 'hwinfo_test'
6. destination 2: Kafka topic named hwinfo_logs_RT that would be used to power the real time dashboard.
7. with the above setup complete test the flask application by running it and ensure the host can ping flask inside the container on port 5000

