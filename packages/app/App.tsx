import React, { useContext } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import AppProvider from "./context/AppProvider";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

let customFonts = {
  "FiraSans-Bold": require("./assets/fonts/FiraSans-Bold.ttf"),
  "FiraSans-Regular": require("./assets/fonts/FiraSans-Regular.ttf"),
};
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SET_INITIAL":
          return {
            ...prevState,
            isInitialStartup: action.isInitialStartup ? true : false,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isInitialStartup: true,
    }
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let isInitialStartup;

      try {
        await Font.loadAsync(customFonts);
        isInitialStartup = AsyncStorage.getItem("isInitialStartup");
        console.log("isInitialStartup", isInitialStartup);
      } catch (e) {}
      dispatch({ type: "SET_INITIAL", isInitialStartup });
    };

    bootstrapAsync();
  }, []);
  const Stack = createStackNavigator();
  console.log("state.isInitialStartup", state.isInitialStartup);
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          {!state.isInitialStartup ? (
            <>
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
