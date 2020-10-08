import React from "react";
import { View, Text, Button } from "react-native";
import Pulse from "react-native-pulse";
import { CopntainerView } from "../components/layout/Container";

const HomeScreen = ({ navigation }) => {
  return (
    <CopntainerView>
      {/* <Text>Home Comp</Text> */}
      <Pulse
        color="#FCE566"
        numPulses={8}
        diameter={300}
        speed={10}
        duration={2000}
      />
      <Text
        style={{ fontFamily: "FiraSans-Bold", fontSize: 40, color: "black" }}
      >
        FIND
      </Text>
      {/* <Buttonn
        title="Go to Settings"
        onPress={() => navigation.navigate("Settings")}
      /> */}
    </CopntainerView>
  );
};

export default HomeScreen;
