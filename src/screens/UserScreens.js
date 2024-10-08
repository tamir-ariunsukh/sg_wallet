import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Platform,
  UIManager,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import BackButton from "../components/BackButton";
import { NumericFormat } from "react-number-format";
import moment from "moment";

import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  HStack,
  Spacer,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  useToast,
  Center,
  Select,
  IconButton,
  Pressable,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AccordionList } from "react-native-accordion-list-view";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { ScrollView } from "react-native-virtualized-view";
import * as Animatable from "react-native-animatable";
import { stringify } from "uuid";

const { width, height } = Dimensions.get("window");

const UserScreens = ({ navigation }) => {
  const [userDatas, setUserDatas] = useState(false);
  console.log(userDatas);
  const getData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/wallets/list`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setUserDatas(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onNavPress = (item) => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Block гаргах",
      textBody: `${item.phone} дугаартай хэрэглэгчийн блокыг гаргах`,
      button: "Unblock",

      onPressButton: () => {
        Dialog.hide();
        unblock(item.phone);
      },
    });
  };

  const unblock = async (phone) => {
    try {
      var requests = JSON.stringify({
        phone: phone,
      });

      var configs = {
        method: "POST",
        url: `${baseUrl}/wallets/unblock`,
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 0,
        data: requests,
      };

      await axios(configs)
        .then(function (response) {
          getData();
        })
        .catch(function (error) {});
    } catch (err) {}
  };
  useEffect(() => {
    getData();
    navigation.setOptions({
      headerLeft: () => <BackButton goBack={navigation.goBack} />,
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);
  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
      }}
    >
      {userDatas.length > 0 ? (
        <ScrollView>
          {userDatas.map((item, index) => (
            <View style={{ paddingTop: 5, paddingBottom: 5 }} key={index}>
              <Box
                alignSelf="center"
                justifyContent="center"
                width={"90%"}
                key={item._id}
                borderBottomWidth="2"
                _dark={{
                  borderColor: "gray.600",
                }}
                borderColor="gray.300"
              >
                <TouchableOpacity
                  onPress={
                    item.authLock === true || item.Blocked === true
                      ? () => onNavPress(item)
                      : () => console.log("Heello")
                  }
                >
                  <View>
                    <HStack justifyContent="space-between">
                      <VStack justifyContent="center" width="50%">
                        <Text
                          fontSize={16}
                          color={
                            item.role === "user" ? "green.400" : "amber.400"
                          }
                          fontWeight={"semibold"}
                        >
                          {item.phone}
                        </Text>
                        <Text
                          fontSize={11}
                          color={
                            item.authLock === true || item.Blocked === true
                              ? "#ff0000"
                              : "#242B2E"
                          }
                          _dark={{
                            color: "warmGray.200",
                          }}
                        >
                          Хэрэглэгчийн эрх: {item.role}
                          {item.authLock === true || item.Blocked === true
                            ? " Blocked"
                            : ""}
                        </Text>
                      </VStack>
                      <Spacer />
                      <NumericFormat
                        value={item.balance.$numberDecimal}
                        displayType={"text"}
                        thousandSeparator={true}
                        renderText={(formattedValue) => (
                          <Text
                            fontWeight={"semibold"}
                            width="50%"
                            textAlign="right"
                            justifyContent="flex-end"
                            alignSelf="center"
                            fontSize={16}
                            color={
                              item.role !== "user" ? "amber.400" : "green.400"
                            }
                          >
                            {formattedValue}₮
                          </Text>
                        )}
                      />
                    </HStack>
                    <Box paddingBottom={"2"} width={"100%"}>
                      <HStack>
                        <Box width={"50%"}>
                          <Text
                            fontSize={10}
                            color={
                              item.authLock.toString() === "true"
                                ? "#ff0000"
                                : "#242B2E"
                            }
                          >
                            Үүсгэсэн:{" "}
                            {moment(item.createdAt).format("YYYY-MM-DD")}
                          </Text>
                        </Box>
                        <Box width={"50%"}>
                          <Text
                            bold
                            textAlign="right"
                            justifyContent={"flex-start"}
                            fontSize={10}
                          >
                            Үлдэгдэл
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </View>
                </TouchableOpacity>
              </Box>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: "center",
            height: "100%",
          }}
        ></View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    minHeight: height * 0.7,
    width,
    backgroundColor: "blue",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default UserScreens;
