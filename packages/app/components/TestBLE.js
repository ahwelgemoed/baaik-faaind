import React, { Component } from "react";
import { Text, View } from "react-native";
import { BleManager } from "react-native-ble-plx";
import Base64 from "./Base64";

export class TestBLE extends Component {
  constructor() {
    super();
    this.manager = new BleManager({
      restoreStateIdentifier: "BleInTheBackground",
      restoreStateFunction: (restoredState) => {
        if (restoredState == null) {
          // BleManager was constructed for the first time.
        } else {
          // BleManager was restored. Check `restoredState.connectedPeripherals` property.
        }
      },
    });
  }

  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);
  }

  async scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      console.log(device.name);
      if (device.name === "raspberrypi") {
        this.dd(device);
        this.manager.stopDeviceScan();
        setTimeout(() => {
          device.cancelConnection();
          console.log("RUN");
        }, 5000);
        // device
        //   .connect()
        //   .then((device) => {
        //     return device.discoverAllServicesAndCharacteristics();
        //   })
        //   .then((device) => {
        //     console.log("device", device.services());

        //     // Do work on device with services and characteristics
        //   })
        //   .catch((error) => {
        //     // Handle errors
        //   });
        // Stop scanning as it's not necessary if you are scanning for one device.

        // Proceed with connection.
      }
    });
  }
  async dd(device) {
    await device.connect();
    await device.discoverAllServicesAndCharacteristics();
    console.log("device", device);
    const services = await device.services();
    const x = await services[0].characteristics();
    const y = await x[0].writeWithResponse(
      Base64.btoa("2"),
      "00010001-89BD-43C8-9231-40F6E305F96D"
    );
    console.log("services", y);
  }
  render() {
    return (
      <View>
        <Text> aaaaajhgfd</Text>
      </View>
    );
  }
}

export default TestBLE;
