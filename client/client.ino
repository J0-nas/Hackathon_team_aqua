#include <Servo.h>
#include <SPI.h>
#include <SD.h>
#include "Wire.h"
#include "Enums.h"

char batteryState = 100;
int ticRate = 1000;

int a0 = 0;
//struct IMU_Measurement cIMU;
int i = 0;
byte loopIter = 0;

boolean sendState;
boolean s = false;

Servo myServo;

const int MPU_addr=0x68;  // I2C address of the MPU-6050

void setup() {
  // put your setup code here, to run once:
  //LED
  pinMode(13, OUTPUT);
  //Button
  pinMode(2, INPUT);

  myServo.attach(9);
  
  Serial.begin(9600);
  Wire.begin();

  //Wake up the IMU
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
}

void loop() {
  // put your main code here, to run repeatedly:
  //batteryState = lowOnBattery();
  if (buttonPressed()) {
    Serial.print("Button pressed! Eject\n");
    waitUntilSurfaced();
    eject();
    if (i == 0) {
      turn(myServo, 90);
      i = 1;
    } else {
      turn(myServo, 0);
      i = 0;
    }
    blink(5000);
  } else {
    if (surfaced()) {
      s = true;
    }
    if (s && (loopIter >= 7)) {
      collectGPS();
      sendGPS();
      s = false;
      loopIter = 0;
    }
    
    sendState = collectSensorData();
    /*if (!sendState) {
      sendEEPROM();
    }*/
    sendState = collectIMU_Measurement();
    /*if (!sendState) {
      sendEEPROM();
    }*/
    if (s) {
      loopIter += 1;
    } else {
      loopIter = 0;
    }
    delay(ticRate);
    //blink(100);
  }
}


void blink(int d) {
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(d);              // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);              // wait for a second
}

