import RPi.GPIO as GPIO

import time   



GPIO.setmode(GPIO.BCM) 



GPIO.setup(23, GPIO.IN)

GPIO.setup(24, GPIO.IN)



triggers = 0

lastpin = 0

triggers_since_consecutive = 0



def gpio_callback(id):

    global triggers

    global lastpin

    global triggers_since_consecutive

    ti = time.time() - triggers_since_consecutive

    if ti > 1:

        print("Direction change")

    triggers += 1

    if lastpin == id:

        print("Consecutive trigger")

    triggers_since_consecutive = time.time()

    lastpin = id

    triggers_since_consecutive += 1

    print("Detected on pin " + str(id) + ", total triggers = " + str(triggers))





GPIO.add_event_detect(23, GPIO.RISING, callback=gpio_callback)



GPIO.add_event_detect(24, GPIO.RISING, callback=gpio_callback)



while True:

    time.sleep(0.05)



GPIO.cleanup()