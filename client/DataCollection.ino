#define tempInterval 10*1000
#define pHInterval 10*1000
#define saltInterval 10*1000
#define heartrateInterval 10*1000

void waitUntilSurfaced() {
  delay(1000);
}

boolean surfaced() {
  return true;
}

void collectGPS() {
  
}

void collectSensorData() {
  int p = getPhoto();
  int t = getTemp();
  Serial.print("temp:\t");
  Serial.print(t);
  Serial.print(", photo:\t");
  Serial.print(p);
  Serial.print("\n");
  blink(100);
}

unsigned int getTemp() {
  return analogRead(A1);
}

unsigned int getPhoto() {
  return analogRead(A0);
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
