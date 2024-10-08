import React from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


import { getStatusBarHeight } from "react-native-status-bar-height";
export default function Background({ children }) {
  return (
    <ImageBackground
      source={require("../assets/background_dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp("100%"),

    position: "absolute",
    height: hp("110%"),
  },
  container: {
    flex: 1,
    paddingTop: hp("1%") + getStatusBarHeight(),
    padding: wp("10%"),
    width: wp("100%"),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
