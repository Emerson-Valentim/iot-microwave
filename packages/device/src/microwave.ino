#include <WiFi.h> //Wifi library
#include <HTTPClient.h> // HTTP library
#include "ArduinoJson.h" // JSON Library
#include <AccelStepper.h>

#define GREEN_LED 32 // G32
#define RED_LED 13 // G13

#define IN1 5 // G5
#define IN2 4 // G4
#define IN3 14 // G14
#define IN4 12 // G12

AccelStepper stepper(AccelStepper::HALF4WIRE, IN1, IN3, IN2, IN4);

boolean isCooking = false;
int endTime = 0;
char* domain = "https://api-microwave.evshosting.net/control";
const int stepsPerRevolution = 4096 * 20;  // change this to fit the number of steps per revolution
StaticJsonDocument<256> doc;

String element;
int timeout;
const char* alias;
const char* requester;

void setup() {
  Serial.begin(115200);
  connectWifi("Merso", "one2...iv", 2000, 20);

  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  
  setupStepper();

  turnGreenAndRedLightOn();
}

void loop() {
  if(!isCooking) {
    element = http_get(domain, "/consume");

    if(!element.length()) {
      turnGreenAndRedLightOff();
      Serial.println("The queue is empty, waiting 5 seconds before calling it again...");
      delay(100);
      return;
    }

    deserializeJson(doc, element);

    timeout = doc["timeInSeconds"];
    alias = doc["alias"];
    requester = doc["requester"];

    Serial.println("Cooking... The current meal is " + String(alias) + " requested by " + String(requester));

    endTime = millis() + (timeout * 1000);
    isCooking = true;

    turnRedLightOn();
    stepper.enableOutputs();
    stepper.setCurrentPosition(0);
    stepper.moveTo(stepsPerRevolution);

    return;
  }

  stepper.run();
  
  if(millis() > endTime) {
    stepper.disableOutputs();
    turnGreenLightOn();
    isCooking = false;
    http_post(domain, "/finish");
    delay(600);
  }
}

void connectWifi(char* ssid, char* password, int timeoutInMs, int tries) {
  Serial.println("[--------Start--------]");
  Serial.print("Connecting wifi, just wait a second while we start reading all your activiy on web.");
  
  WiFi.mode(WIFI_STA);

  int counter = 0;

  WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(timeoutInMs);
    counter++;

    if(counter > tries) {
      Serial.println("Oh no, seems that we failed :(");
      ESP.restart();
    }
  }

  Serial.println("");
  Serial.println("Well, feel free to explode it!");
}

String http_get(char* host, char* path) {
  // This object enables http requests;
  HTTPClient http;

  http.begin(String(host) + String(path));
  int statusCode = http.GET();

  if(statusCode == HTTP_CODE_OK) {
    String payload = http.getString();
    return payload;
  }

  return "";
}

String http_post(char* host, char* path) {
  // This object enables http requests;
  HTTPClient http;

  http.begin(String(host) + String(path));
  int statusCode = http.POST("");

  if(statusCode == HTTP_CODE_OK) {
    String payload = http.getString();
    return payload;
  }

  return "";
}

void turnGreenLightOn() {
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, HIGH);  
}

void turnRedLightOn() {
  digitalWrite(RED_LED, HIGH);
  digitalWrite(GREEN_LED, LOW);
}

void turnGreenAndRedLightOff() {
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
}

void turnGreenAndRedLightOn() {
  digitalWrite(RED_LED,  HIGH);
  digitalWrite(GREEN_LED, HIGH);
}

void setupStepper() {
  stepper.setMaxSpeed(1000);
  stepper.setAcceleration(2000);
  stepper.moveTo(stepsPerRevolution);
}