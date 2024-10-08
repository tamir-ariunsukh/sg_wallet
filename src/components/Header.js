import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
export default function Header(props) {
  return <Text style={styles.header} {...props} />;
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    paddingTop: hp("1%"),
    fontSize: 21,

    fontWeight: "bold",
  },
});
