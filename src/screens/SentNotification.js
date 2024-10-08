import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Platform, UIManager, Image, StatusBar, SafeAreaView, Dimensions, } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import BackButton from "../components/BackButton"
import { NumericFormat } from "react-number-format";
import moment from "moment";

import { MaterialIcons, Feather, Entypo, AntDesign, FontAwesome5, MaterialCommunityIcons, FontAwesome, Octicons } from "@expo/vector-icons";
import { Button, Modal, Text, NativeBaseProvider, HStack, Spacer, Stack, TextArea, FormControl, Input, Box, VStack, Heading, useToast, Center, Select, IconButton } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AccordionList } from "react-native-accordion-list-view";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { ScrollView } from 'react-native-virtualized-view'
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get('window');

const SentNotification = ({ navigation }) => {
  const [userDatas, setUserDatas] = useState(false);

  const [textAreaValue, setTextAreaValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");

  console.log(textAreaValue + "        " + textInputValue)
  const SentToNotification = () => {
    if (textAreaValue !== "" && textInputValue !== "") {
      let data = JSON.stringify({
        "title": textInputValue,
        "body": textAreaValue
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}/marketing/sent`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Мэдэгдэл",
            textBody: `Амжилттай мэдэгдэл илгээлээ`,
            button: "Okey",
            onPressButton: () => {
              Dialog.hide();
              navigation.reset({
                index: 0,
                routes: [{ name: "TabbarScreen" }],
              });
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    
  }

  useEffect(() => {
    SentToNotification();
    navigation.setOptions({
      headerLeft: () => (
        <BackButton goBack={navigation.goBack} />
      ),
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
    ><Box alignItems="center" w="100%">
        <Text paddingTop={6}>Гарчигаа бичнэ үү</Text>
        <Input fontSize={"md"} onChangeText={text => setTextInputValue(text)} mx="3" placeholder="Гарчиг" w="75%" />
        <Text paddingTop={6}>Бүтэн текстээ бичнэ үү</Text>
        <TextArea fontSize={"md"} onChangeText={text => setTextAreaValue(text)} h={20} placeholder="Энд дарж бичээрэй" w="75%" maxW="300" />
        <Box width={"75%"} paddingTop={6}><Button onPress={() => { SentToNotification() }} colorScheme="success">Илгээх</Button></Box></Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    minHeight: height * 0.7,
    width,
    backgroundColor: 'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default SentNotification;
