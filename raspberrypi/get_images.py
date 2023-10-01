from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import cv2
import numpy as np
import os
from dotenv import load_dotenv, dotenv_values


# Will load the .env file where the environment variables are stored for security
load_dotenv()

# mongodb uri obtained using the environment variables
uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB")

client = MongoClient(uri, server_api=ServerApi("1"))

# Connect to the MongoDB database and collection within the database
db = client[f"{db_name}"]
image_collection = db["car_images"]


latest_image = image_collection.find_one(sort=[("timestamp", -1)])

if latest_image:
    image_data = latest_image["image"]

    b_convert = np.frombuffer(image_data, np.uint8)

    img = cv2.imdecode(b_convert, cv2.IMREAD_COLOR)

    cv2.imshow("Retrieved Image", img)
    cv2.waitKey(0)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        cv2.destroyAllWindows()
else:
    print("No image found in the database.")
