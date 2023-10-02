from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import paho.mqtt.client as mqtt
from dotenv import load_dotenv, dotenv_values
import cv2
import numpy as np
import time
import os


# Will load the .env file where the environment variables are stored for security purposes
load_dotenv()

# mongodb uri obtained using the environment variables
uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB")

client = MongoClient(uri, server_api=ServerApi("1"))

# Connect to the MongoDB database and collection within the database
db = client[f"{db_name}"]
image_collection = db["car_images"]

distances = {
    "parking_lot/sensors/ultrasonic1": 0,
    "parking_lot/sensors/ultrasonic2": 0
}

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("parking_lot/sensors/ultrasonic1")
    client.subscribe("parking_lot/sensors/ultrasonic2")

def on_message(client, userdata, msg):
    print(f"{msg.topic}: {msg.payload.decode()}")

    # Update the respective sensor's distance
    distances[msg.topic] = float(msg.payload.decode())

   
    if distances["parking_lot/sensors/ultrasonic1"] < 100 and distances["parking_lot/sensors/ultrasonic2"] < 100:
        print("Parking bay full")
        time.sleep(10)


camera = cv2.VideoCapture(0)
camera.set(3, 640)
camera.set(4, 480)


car_cascade = cv2.CascadeClassifier("cars.xml")


last_captured_time = None

while True:
    ret, frame = camera.read()

    if not ret:
        print("Failed to grab frame")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    cars = car_cascade.detectMultiScale(gray, 1.1, 4)

    current_time = time.time()

    should_capture = (
        last_captured_time is None or (current_time - last_captured_time) >= 60
    )

    if should_capture and len(cars) > 0:
        for x, y, w, h in cars:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        ret, buffer = cv2.imencode(".png", frame)
        image_data = buffer.tobytes()

        image_collection.insert_one({"image": image_data, "timestamp": current_time})

        last_captured_time = current_time

    cv2.imshow("Car Detection", frame)

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("broker.hivemq.com", 1883, 60)

    client.loop_start()
    time.sleep(5)  # Loop for 10 seconds
    client.loop_stop()
    time.sleep(5)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()
