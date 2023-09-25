from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import cv2
import numpy as np
import time


client = MongoClient(MONGODB_URI, server_api=ServerApi("1"))
db = client[MONGODB_DB]
image_collection = db["car_images"]


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

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()