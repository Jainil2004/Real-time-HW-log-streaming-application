# Real-time-HW-log-streaming-application
The Real-Time Hardware Monitoring and Analysis system is my current best flagship project. It harnesses the power of the Big Data ecosystem, including Apache Spark, Apache Kafka, and Elasticsearch. This project is a comprehensive integration of Big Data tools, backend, frontend development, and advanced analytics, reflecting my growth in coding, system design, and performance bench-marking.

## project Overview
The system streams hardware logs using Hwinfo containing crucial sensor data to analyze and predict performance bottlenecks such as CPU core thermal throttling and power limit throttling. This real-time insights allow system maintainers and people like me who like to mess with the power and voltage sliders in XTU understand system behavior in real time while also providing a way to check historical data.

### Tehnology stack and Tools used
- Big Data tools: Apache Kafka for real-time data streaming, Apache Spark for streaming data processing with ML model prediction and Elasticsearch for storage and querying of processed logs.
- Front-end: uses Vanilla HTML, CSS and JavaScript for developing a dynamic dashboard that provides the user with quick look at crucial system variables such as CPU package temperature, package power, clocks, VID and more.
- Back-end: The system uses Flask for its back-end because of its lightness and simple use.
- AI model: uses Spark's MLlib library for random forest model training and use. the model is trained on data containing sensor data over a two hour period where the data was collected every second and under various stress levels such as video editing, normal browsing and Cinebench/furmark stress tests.

## project setup
Although the application can be deployed natively on all operating systems, it is recommended to be deploayed in either Linux or using docker containers.
for this particular setup process we will be working with docker containers as files for running on docker are also provided in the main directory.
we will be deploying the project using docker in Windows 10/11

**Step 1: Pre-Requsites**
- Turn on VBS (Virtualization Based security/ Memory Integrity) for WSL2 and docker desktop
- Ensure WSL2 is installed on the host system where the project will be used on. follow the guide here: [Install WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)
- Download docker desktop from the install link here: [Install docker desktop](https://www.docker.com/products/docker-desktop/)
- Download hwinfo from the install link here: [Install Hwinfo](https://www.hwinfo.com/download/) 

**Step 2: Clone the repo or download ZIP**
- Use the following command to clone the repo: 
`git clone https://github.com/Jainil2004/Real-time-HW-log-streaming-application`
- Copy the above command and paste it in git bash terminal
- To download the ZIP for this repo **Scroll to the top** of the page
- Click on the green **Code** block. inside the drop down menu select **download ZIP** option
- Or just use the following link: [Download Repo ZIP](https://github.com/Jainil2004/Real-time-HW-log-streaming-application/archive/refs/heads/main.zip)

**Step 3: Setting up docker**
- Open docker desktop and wait until docker engine is up and running
- Next open a new terminal inside the repository folder where the `docker-compose.yaml` file is located
- Enter the following command: `docker-compose -d up`
- Wait until all the images are pulled and containers are built. *It will take a while first time*
- subsequentally, next time when using the application use `docker-compose start` to start all container and `docker-compose stop` to stop all containers

**Step 4: Starting the Application**
- Start Hwinfo and select the following schema:


| Hwinfo Schema/Data Features     | 
|----------------------------------| 
| Time                             | 
| Date                             | 
| Core_VIDs_avg_V                  | 
| Core_Clocks_avg_MHz              | 
| Ring_LLC_Clock_MHz               | 
| Core_Usage_avg_percent           | 
| Core_Temperatures_avg_C          | 
| Core_Distance_to_TjMAX_avg_C     | 
| CPU_Package_C                    | 
| CPU_Package_Power_W              | 
| PL1_Power_Limit_Static_W         | 
| PL1_Power_Limit_Dynamic_W        | 
| PL2_Power_Limit_Static_W         | 
| PL2_Power_Limit_Dynamic_W        |

**DO NOTE: the model expects the above defined schema at minimum! you can add more data features upon your liking**

- Once the schema is selected start logging and save it as the `test1.csv` file present inside the `notebooks` directory. 
- next run the code inside the files sequentially mentioned below.

` kakfaTwoWayStreaming.ipynb -> finalSparkKafkaESHwinfoTwoWayStreamingApplication.ipynb -> Flask6.py `

- once all the three above files are running inside the jupyter container. go back to repo directory and inside `dashboard_new` folder
- inside `dashboard_new` directory, open `index.html` and the application is ready to use

### General Queries
if the dashboard doesnt work right away. restart the `finalSparkKafkaESHwinfoTwoWayStreamingApplication.ipynb' and wait a few seconds.

## V2.0
introducing V2.0 of the Real-Time hardware Monitoring and Analysis system, I have improved upon the RT dashboard by adding CPU and GPU fan profiles. the dashboard now features two more graphs that represent CPU and GPU fan speeds which are dynamic and align well with rest of the components of the RT dashboard.

- Added CPU and GPU fan speed features in data pipeline 
- Added two more graphs in RT dashboard for real time view of system fans