from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import cv2
import numpy as np




client = MongoClient(MONGODB_URI, server_api=ServerApi("1"))
db = client[MONGODB_DB]
image_collection = db['car_images']


latest_image = image_collection.find_one(sort=[('timestamp', -1)])

if latest_image:
    image_data = latest_image['image']

    
    b_convert = np.frombuffer(image_data, np.uint8)

   
    img = cv2.imdecode(b_convert, cv2.IMREAD_COLOR)

    
    cv2.imshow('Retrieved Image', img)
    cv2.waitKey(0)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        cv2.destroyAllWindows()
else:
    print("No image found in the database.")