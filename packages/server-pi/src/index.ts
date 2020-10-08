import bleno from "bleno";
const Characteristic = bleno.Characteristic;
const LEDCONTROLLER_SERVICE_UUID = "00010000-89BD-43C8-9231-40F6E305F96D";
const LED_PATTERN_UUID = "00010001-89BD-43C8-9231-40F6E305F96D";
// const LED_PATTERN_UUIDS = "00010001-89BD-43C8-9231-40F6E305F96F";

bleno.on("stateChange", function (state: any) {
  console.log("🔥 " + state);
  if (state === "poweredOn") {
    bleno.startAdvertising("myRPi", [LEDCONTROLLER_SERVICE_UUID]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("accept", function (clientAddress: any) {
  console.log("Connection ACCEPTED from address:" + clientAddress);
  bleno.stopAdvertising();
  console.log("Stop advertising …");
});

// DISCONNECT:
// Disconnected from a client
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
