import RPi.GPIO as GPIO

import time   



GPIO.setmode(GPIO.BCM)



GPIO.setup(23, GPIO.IN)

GPIO.setup(24, GPIO.IN)

lastpin = 0

trig = 0

def gpio_callback_1(id):

    global trig
    global lastpin
    
    if lastpin == id:
        print("Consecutive, since last: " + str(trig))
        trig = 0
    else:   
        trig+=1
        lastpin = id

    print("Rising")    

def gpio_callback_2(id):

    global lastpin
    global trig
    trig += 1
    lastpin = id

    print("Falling")


GPIO.add_event_detect(24, GPIO.RISING, callback=gpio_callback_1, bouncetime=100)
GPIO.add_event_detect(23, GPIO.RISING, callback=gpio_callback_2, bouncetime=100)

while True:

    time.sleep(0.05)



GPIO.cleanup()