char batteryState = 100;
int ticRate = 1000*10;

void setup() {
  // put your setup code here, to run once:
  pinMode(13, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  batteryState = lowOnBattery();
  if (batteryState <= 14) {
    waitUntilSurfaced();
    eject();
  } else {
    if (surfaced()) {
      collectGPS();
      sendGPS();
    }
    collectSensorData();
    delay(ticRate);
  }
}


void blink() {
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);              // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);              // wait for a second
}

