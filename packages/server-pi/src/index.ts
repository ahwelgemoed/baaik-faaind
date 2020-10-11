import * as dotenv from "dotenv";
import bleno from "@abandonware/bleno";
dotenv.config({ path: __dirname+'/.env' });
const Characteristic = bleno.Characteristic;
const LEDCONTROLLER_SERVICE_UUID = "00010000-89BD-43C8-9231-40F6E305F96D";
const LED_PATTERN_UUID = "00010001-89BD-43C8-9231-40F6E305F96D";
// const LED_PATTERN_UUIDS = "00010001-89BD-43C8-9231-40F6E305F96F";

const { DEVICE_NAME,INITIAL_SETUP } =process.env
console.log("🔥", process.env.FOO);
bleno.on("stateChange", function (state: any) {
  console.log("🔥 " + state);
  if (state === "poweredOn") {
    bleno.startAdvertising(DEVICE_NAME, [LEDCONTROLLER_SERVICE_UUID]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("accept", function (clientAddress: any) {
  if(INITIAL_SETUP){
    console.log("Connection ACCEPTED from address:" + clientAddress);
    bleno.stopAdvertising();
    return
  }

  if(!INITIAL_SETUP && DEVICE_NAME == clientAddress){
    console.log("Connection ACCEPTED from address:" + clientAddress);
    bleno.stopAdvertising();
    return
  }

  if(!INITIAL_SETUP && DEVICE_NAME != clientAddress){
    bleno.disconnect()
    return
  }
});

bleno.on("disconnect", function (clientAddress: any) {
  console.log("Disconnected from address:" + clientAddress);
  bleno.startAdvertising("null");
  // isAdvertising = true;
  console.log("Start advertising …");
});





const turnOnCharacteristic = new Characteristic({
  uuid: LED_PATTERN_UUID,
  properties: ["read", "write"],
  value: null,
  descriptors: [
    new bleno.Descriptor({
      uuid: "2901",
      value: "Koos",
    }),
  ],
  onReadRequest: function (data: any, callback: any) {
    try {
      console.log("onReadRequest", data, callback);
      return callback(Characteristic.RESULT_SUCCESS, new Buffer([98]));
    } catch (error) {}
  },
  onWriteRequest: function (
    data: any,
    offset: any,
    withoutResponse: any,
    callback: any
  ) {
    try {
      console.log("writeRequest", data, offset, withoutResponse, callback);
      const c = data.readUInt8(0);
      console.log("c", c, parseInt(data));
      return callback(Characteristic.RESULT_SUCCESS);
    } catch (error) {}
  },
});

bleno.on("advertisingStart", (err: any) => {
  console.log("Configuring services...");

  if (err) {
    console.error(err);
    return;
  }

  let LEDController = new bleno.PrimaryService({
    uuid: LEDCONTROLLER_SERVICE_UUID,
    characteristics: [turnOnCharacteristic],
  });

  bleno.setServices([LEDController], (err: any) => {
    if (err) console.log(err);
    else console.log("Services configured");
  });
});




// scp index_.js index_bleno.js package.json pi@192.168.178.30:testBleno/
// some diagnostics
bleno.on("stateChange", (state: any) =>
  console.log(`Bleno: Adapter changed state to ${state}`)
);

bleno.on("advertisingStart", () => console.log("Bleno: advertisingStart"));
bleno.on("advertisingStartError", () =>
  console.log("Bleno: advertisingStartError")
);
bleno.on("advertisingStop", () => console.log("Bleno: advertisingStop"));

bleno.on("servicesSet", () => console.log("Bleno: servicesSet"));
bleno.on("servicesSetError", () => console.log("Bleno: servicesSetError"));

bleno.on("accept", (clientAddress: any) =>
  console.log(`Bleno: accept ${clientAddress}`)
);
bleno.on("disconnect", (clientAddress: any) =>
  console.log(`Bleno: disconnect ${clientAddress}`)
);
// scp -r  server-pi pi@192.168.178.30:server-pi/
// "xpc-connection": "git://github.com/taoyuan/node-xpc-connection.git"
// 