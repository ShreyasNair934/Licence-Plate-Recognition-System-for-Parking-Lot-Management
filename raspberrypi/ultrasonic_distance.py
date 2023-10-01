import RPi.GPIO as GPIO
import time


class UltrasonicSensor:
    def __init__(self, trigger_pin, echo_pin):
        self.trigger_pin = trigger_pin
        self.echo_pin = echo_pin

        # GPIO Mode (BOARD / BCM)
        GPIO.setmode(GPIO.BCM)

        # Set GPIO directions (IN / OUT)
        GPIO.setup(self.trigger_pin, GPIO.OUT)
        GPIO.setup(self.echo_pin, GPIO.IN)

    def measure_distance(self):
        # Set Trigger to HIGH
        GPIO.output(self.trigger_pin, True)

        # Set Trigger after 0.01ms to LOW
        time.sleep(0.00001)
        GPIO.output(self.trigger_pin, False)

        StartTime = time.time()
        StopTime = time.time()

        # Save StartTime
        while GPIO.input(self.echo_pin) == 0:
            StartTime = time.time()

        # Save time of arrival
        while GPIO.input(self.echo_pin) == 1:
            StopTime = time.time()

        # Time difference between start and arrival
        TimeElapsed = StopTime - StartTime
        # Multiply with the sonic speed (34300 cm/s)
        # and divide by 2, because there and back
        distance = (TimeElapsed * 34300) / 2

        return distance

    @staticmethod
    def cleanup():
        GPIO.cleanup()
