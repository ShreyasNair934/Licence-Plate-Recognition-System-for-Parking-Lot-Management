from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


class Carpark:
    def __init__(self):
        self.uri = "MONGODB_SECRET_URI"
        self.db_name = "webapp_test"
        self.client = MongoClient(self.uri, server_api=ServerApi('1'))
        self.db = self.client[f"{self.db_name}"]

        self.carpark_availability_collection = self.db["carpark_availability"]

    def update_availability(self, sensor_no, occupied):
        result = self.carpark_availability_collection.update_one({"carpark_no": sensor_no}, {
            "$set": {"carpark_occupied": occupied, "last_updated": datetime.now().isoformat()}})

        if result.acknowledged:
            print(
                f"Successfully updated carpark {sensor_no} occupied status to: {occupied}")
        else:
            print("Update unsuccessful")

    def close_connection(self):
        self.client.close()
