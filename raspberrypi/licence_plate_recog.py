from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv, dotenv_values
import cv2
import numpy as np
import pytesseract
import time
import os

# Will load the .env file where the environment variables are stored for security
load_dotenv()

# mongodb uri obtained using the environment variables
uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB")
vehicle_collection = os.getenv("MONGODB_COLLECTION")
client = MongoClient(uri, server_api=ServerApi("1"))

# Connect to the MongoDB database and collection within the database
db = client[f"{db_name}"]
collection = db[f"{vehicle_collection}"]

image_collection = db["car_images"]


def detect_license_plate():
    # Get latest image from car_image collection in the database
    latest_image = image_collection.find_one(sort=[("timestamp", -1)])

    if latest_image:
        image_data = latest_image["image"]

    buffer_convert = np.frombuffer(image_data, np.uint8)

    img = cv2.imdecode(buffer_convert, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    gray = cv2.bilateralFilter(gray, 13, 15, 15)

    edged = cv2.Canny(gray, 30, 200)

    detect_plate_boundry, _ = cv2.findContours(
        edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
    )

    detect_plate_boundry = sorted(
        detect_plate_boundry, key=cv2.contourArea, reverse=True
    )[:10]
    count_screens = None

    for c in detect_plate_boundry:
        perimeter = cv2.arcLength(c, True)
        calculated_approx = cv2.approxPolyDP(c, 0.018 * perimeter, True)

        if len(calculated_approx) == 4:
            count_screens = calculated_approx
            break

    if count_screens is None:
        print("Could not find license plate.")
        return

    mask = cv2.drawContours(gray, [count_screens], -1, (0, 255, 0), 3)

    # Crops the license plate out of the image
    x, y, w, h = cv2.boundingRect(count_screens)
    cropped_license_plate = gray[y : y + h, x : x + w]

    #Using pytesseract to extract the text from license plate
    text = pytesseract.image_to_string(cropped_license_plate, config="--psm 8")
    print("Detected license plate:", text.replace("|", "").strip())

    vehicle_collection.insert_one(
        {
            "vehicle_no": text.replace("|", "").strip(),
            "entry_time": time.time(),
            "exit_time": "null",
            "in_carpark": True,
        }
    )

    cv2.imshow("Original Image", img)

    cv2.imshow("Cropped License Plate", cropped_license_plate)

    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":
    detect_license_plate()
