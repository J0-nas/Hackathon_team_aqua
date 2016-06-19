#include <EEPROM.h>

//Since we save 2 bytes
#define MAX_ADDRESS 1022

int address = 0;

boolean buttonPressed() {
  int buttonState = digitalRead(2);
  if (buttonState == HIGH) {
    return true;
  }
  return false;
}

unsigned int lowOnBattery() {
  return analogRead(A7);
}

void turn(Servo s, int d) {
  if (d > 180) {
    d = 180;
  }
  s.write(d);
}

boolean writeSensorMeasurement(char t, unsigned int measurement) {
  if (address >= MAX_ADDRESS) {
    return false;
  }
  
  byte offset = 0;
  switch(t){
    case 'T':
      offset = 0x00;
      break;
     case 'P':
      offset = 0x10;
      break;
     case 'D':
      offset = 0x20;
      break;
     case 'C':
      offset = 0x30;
      break;
     case 'B':
      offset = 0x40;
      break;
     default:
      offset = 0xE0;
      break;
  }
  //Cutoff part for the type
  measurement = measurement & 0x1FFF;
  //Add the type
  measurement = measurement | (offset << 8);

  EEPROM.put(address, measurement);
  address += 2;
  return true;
}

boolean writeIMU_Measurement(struct IMU_Measurement m) {
  int offset = 0xF0;
  if (address+14 > MAX_ADDRESS) {
    return false;
  }
  EEPROM.put(address, m.AcX);
  address += 2;
  EEPROM.put(address, m.AcY);
  address += 2;
  EEPROM.put(address, m.AcZ);
  address += 2;
  EEPROM.put(address, m.Tmp);
  address += 2;
  EEPROM.put(address, m.GyX);
  address += 2;
  EEPROM.put(address, m.GyY);
  address += 2;
  EEPROM.put(address, m.GyZ);
  address += 2;
}

void eject() {
  
}

boolean sendGPS() {
  Serial.print("\n{\"long\":60.938,\"lat\":19.433}\n");
  return true;
}

boolean sendSensorMeasurement(char t, unsigned int measurement) {
   byte offset = 0;
  switch(t){
    case 'T':
      offset = 0x00;
      break;
     case 'P':
      offset = 0x10;
      break;
     case 'D':
      offset = 0x20;
      break;
     case 'C':
      offset = 0x30;
      break;
     case 'B':
      offset = 0x40;
      break;
     default:
      offset = 0xE0;
      break;
  }
  //Cutoff part for the type
  measurement = measurement & 0x1FFF;
  //Add the type
  measurement = measurement | (offset << 8);
  Serial.print(measurement);
  Serial.print("\n");
  return true;
}

boolean sendIMU_Measurement(struct IMU_Measurement m) {
  Serial.print(0xF0);
  Serial.print(m.AcX);
  Serial.print(m.AcY);
  Serial.print(m.AcZ);
  Serial.print(m.Tmp);
  Serial.print(m.GyX);
  Serial.print(m.GyY);
  Serial.print(m.GyZ);
  Serial.print("\n");
  return true;
}

boolean sendEEPROM() {
  for (int index = 0 ; index < EEPROM.length() ; index++) {
    //Add one to each cell in the EEPROM
    Serial.print(EEPROM[index]);
  }
  address = 0;
}


