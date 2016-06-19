enum measurementType {
  TEMP, //T
  PHOTO, //P
  DEPTH //D
};

typedef struct IMU_Measurement {
  int AcX;
  int AcY;
  int AcZ;
  int Tmp;
  int GyX;
  int GyY;
  int GyZ;
} IMU_Measurement;
