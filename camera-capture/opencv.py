import cv2
import time

plate_cascade = cv2.CascadeClassifier('haarcascade_russian_plate_number.xml')  

cap = cv2.VideoCapture(0)

while True:

    ret, frame = cap.read()

    if ret:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        plates = plate_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in plates:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            plate = frame[y:y+h, x:x+w]
            cv2.imwrite("license_plate_{}.jpg".format(time.strftime("%Y%m%d-%H%M%S")), plate)

        cv2.imshow("Camera", cv2.resize(frame, (640, 480)))

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()

cv2.destroyAllWindows()
