#define tempInterval 10*1000
#define pHInterval 10*1000
#define saltInterval 10*1000
#define heartrateInterval 10*1000

void waitUntilSurfaced() {
  delay(1000);
}

boolean surfaced() {
  if (getDepth() < 50) {
    return true;
  }
  return false;
}

void collectGPS() {
  
}

boolean collectSensorData() {
  unsigned int p = getPhoto();
  unsigned int t = getTemp();
  unsigned int d = getDepth();
  unsigned int c = getCon();

  unsigned int b = lowOnBattery();
  blink(100);

  sendSensorMeasurement('P', p);
  sendSensorMeasurement('T', t);
  sendSensorMeasurement('D', d);
  sendSensorMeasurement('C', c);
  sendSensorMeasurement('B', b);
  
  /*boolean full = writeSensorMeasurement('P', p);
  if (!full) {
    return false;
  }
  full = writeSensorMeasurement('T', t);
  if (!full) {
    return false;
  }

  full = writeSensorMeasurement('D', d);
  if (!full) {
    return false;
  }
  full = writeSensorMeasurement('C', c);
  if (!full) {
    return false;
  }
  full = writeSensorMeasurement('B', b);
  if (!full) {
    return false;
  }*/
  
  /*Serial.print("temp:\t");
  Serial.print(t);
  Serial.print(", photo:\t");
  Serial.print(p);
  Serial.print(", depth:\t");
  Serial.print(d);
  Serial.print(", cond:\t");
  Serial.print(c);
  Serial.print(", battery:\t");
  Serial.print(b);
  
  Serial.print("\n");
  */
  return true;
}

unsigned int getTemp() {
  return analogRead(A1);
}

unsigned int getPhoto() {
  return analogRead(A0);
}

unsigned int getDepth() {
  return analogRead(A2);
}

unsigned int getCon() {
  return analogRead(A3);
}

unsigned int getPH() {
  return 0;
}

unsigned int getSalt() {
  return 0;
}

unsigned int getGPS() {
  return 0;
}

unsigned int getHeartrate() {
  return 0;
}
