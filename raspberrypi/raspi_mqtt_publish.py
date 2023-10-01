import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt


GPIO.setmode(GPIO.BCM)

# Set GPIO Pins
GPIO_TRIGGER1 = 18
GPIO_ECHO1 = 24
GPIO_TRIGGER2 = 23
GPIO_ECHO2 = 25

# Set GPIO direction (IN / OUT)
GPIO.setup(GPIO_TRIGGER1, GPIO.OUT)
GPIO.setup(GPIO_ECHO1, GPIO.IN)
GPIO.setup(GPIO_TRIGGER2, GPIO.OUT)
GPIO.setup(GPIO_ECHO2, GPIO.IN)

def distance(trigger, echo):
    # Set trigger to HIGH
    GPIO.output(trigger, True)
 
    
    time.sleep(0.00001)
    GPIO.output(trigger, False)
 
    start_time = time.time()
    stop_time = time.time()
 
    # Save start time
    while GPIO.input(echo) == 0:
        start_time = time.time()
 
    # Save time of arrival
    while GPIO.input(echo) == 1:
        stop_time = time.time()
 
    
    time_elapsed = stop_time - start_time
   
    distance = (time_elapsed * 34300) / 2
 
    return distance

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")


client = mqtt.Client()
client.on_connect = on_connect


client.connect("broker.hivemq.com", 1883, 60)

try:
    while True:
        sensor1 = distance(GPIO_TRIGGER1, GPIO_ECHO1)
        sensor2 = distance(GPIO_TRIGGER2, GPIO_ECHO2)
        print(f"Parking Bay A: {sensor1}cm, Parking Bay B: {sensor2}cm")

        # Publish distances to MQTT broker
        client.publish("parking_lot/sensors/ultrasonic1", sensor1)
        client.publish("parking_lot/sensors/ultrasonic2", sensor2)

        time.sleep(1)

except KeyboardInterrupt:
    print("Measurement stopped by user")
    GPIO.cleanup()
