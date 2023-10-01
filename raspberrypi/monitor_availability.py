import time
from ultrasonic_distance import UltrasonicSensor
from carpark_db_helper import Carpark


carparkDb = Carpark()

if __name__ == '__main__':
    try:
        # Sensor for car park 1
        sensor_1 = UltrasonicSensor(trigger_pin=18, echo_pin=24)
        prev_value_1 = None  # Store the previous value

        # Sensor for car park 2
        sensor_2 = UltrasonicSensor(trigger_pin=16, echo_pin=26)
        prev_value_2 = None  # Store the previous value

        while True:

            dist_1 = sensor_1.measure_distance()
            dist_2 = sensor_2.measure_distance()
            isOccupied_1 = "true" if dist_1 < 100 else "false"
            isOccupied_2 = "true" if dist_2 < 100 else "false"

            # This should only update the database if there's a change in the car park availability
            if prev_value_1 is None or isOccupied_1 != prev_value_1:
                carparkDb.update_availability(1, dist_1 < 100)
                prev_value_1 = "true" if dist_1 < 100 else "false"

            # This should only update the database if there's a change in the car park availability
            if prev_value_2 is None or isOccupied_2 != prev_value_2:
                carparkDb.update_availability(2, dist_2 < 100)
                prev_value_2 = "true" if dist_2 < 100 else "false"

            time.sleep(10)

    # Reset by pressing CTRL + C
    except KeyboardInterrupt:
        print("Measurement stopped by User")
        UltrasonicSensor.cleanup()
        carparkDb.close_connection()
