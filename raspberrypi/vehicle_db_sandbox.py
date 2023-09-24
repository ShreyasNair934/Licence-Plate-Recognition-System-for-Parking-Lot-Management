import string
import random
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv, dotenv_values
from datetime import datetime
import os


# Will load the .env file where the environment variables are stored for security
load_dotenv()

# mongodb uri obtained using the environment variables
uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB_NAME")
collection_name = os.getenv("MONGODB_COLLECTION_NAME")
client = MongoClient(uri, server_api=ServerApi('1'))

# Connect to the MongoDB database and collection within the database
db = client[f"{db_name}"]
collection = db[f"{collection_name}"]


# Create a VehicleData class to store the vehicle data, has fields for vehicle_no, entry_time, exit_time and in_carpark, might also need a field for images
# Only for example testing - this class has random numberplate info and entry_time is set to the current time when the object is created
class VehicleData:
    def __init__(self, entry_time=datetime.now().isoformat(), exit_time=None, in_carpark=True):
        self.vehicle_no = self.generate_random_vehicle_number()
        self.entry_time = entry_time
        self.exit_time = exit_time
        self.in_carpark = in_carpark

    # Object method to Insert the vehicle data into the MongoDB database
    def insert_vehicle_data(self):
        result = collection.insert_one(self.__dict__)
        # # Check if the vehicle data insert was successful
        if result.acknowledged:
            print(
                f"Successfully inserted vehicle with collection id: {result.inserted_id} and numberplate: {self.vehicle_no}")
        else:
            print("Insert unsuccessful")

        client.close()

    # Static method to generate a random vehicle numberplate only for example testing
    @staticmethod
    def generate_random_vehicle_number():
        letters = ''.join(random.choices(string.ascii_uppercase, k=3))
        number = str(random.randint(1, 5))
        suffix = ''.join(random.choices(string.ascii_uppercase, k=3))
        return f"{letters}{number}{suffix}"


# Example for creating a VehicleData object and then inserting it into the MongoDB database
vehicle = VehicleData()
vehicle.insert_vehicle_data()
