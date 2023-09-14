from flask import Flask, Response
from picamera import PiCamera
from pymongo import MongoClient
from datetime import datetime
import io

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client["parking_zone_one"]
images = db["images"]

def capture_license_plate():
    stream = io.BytesIO()
    with PiCamera() as camera:
        camera.capture(stream, format='jpeg')
    stream.seek(0)
    return stream

@app.route('/capture')
def capture():
    image_stream = capture_license_plate()
    result = images.insert_one({
        "timestamp": datetime.utcnow(),
        "image": image_stream.getvalue()
    })
    return f"Image captured and stored"

@app.route('/latest')
def latest_image():
    # Fetch the latest image from MongoDB
    latest = images.find_one(sort=[('timestamp', -1)])
    if latest:
        response = Response(latest['image'], content_type='image/jpeg')
        return response
    else:
        return "No images available", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
