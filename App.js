import React, { useCallback, useState, useEffect, useRef } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "./src/baseUrl";
import FlatBoard from "react-native-flatboard";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import {
  Text,
  TextInput,
  LogBox,
  StatusBar,
  Alert,
  Linking,
  View,
} from "react-native";

import axios from "axios";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { ThemeProvider } from "./src/features/theme";
import { StateProvider } from "./src/Context/StateContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import StackScreen from "./src/screens/StackScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Та мэдэгдэл хүлээн авах уу",
        "My Alert Msg",
        [
          {
            text: "Cancel",
            onPress: () => Linking.openSettings(),
            style: "cancel",
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              "This alert was dismissed by tapping outside of the alert dialog."
            ),
        }
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Бодит утас ашиглана уу ;)");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const Stack = createStackNavigator();

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
export default function App({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = () => {
    setIsLoading(true);
  };

  const [themeName, setThemeName] = useState("main");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  AsyncStorage.getItem("user_notification")
    .then((result) => {
      if (result === null) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Мэдэгдэл",
          textBody: `Та мэдэгдэл хүлээн авахыг тохируулаагүй байна. Мэдэгдэл авахыг хүсвэл ок дарна уу`,
          button: "Okey",
          onPressButton: () => {
            Dialog.hide();
            getPushNotification();
          },
        });
      }
    })
    .catch(() => {
      console.log("uuid baihgui");
    });

  const getPushNotification = async () => {
    let data = JSON.stringify({
      token: expoPushToken,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/marketing/get`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        AsyncStorage.setItem("user_notification", expoPushToken);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
    ]);

    setThemeName("light");
    onLayoutRootView();
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [fontsLoaded] = useFonts({
    bold: require("./src/assets/font/SamsungSans-Bold.ttf"),
    regular: require("./src/assets/font/SamsungSans-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  const data = [
    {
      id: 1,
      title: "Цуглуул",
      description: "Та худалдан авалт бүрээсээ оноогоо цуглуулна",
      icon: require("./src/assets/onboard1.jpg"),
    },
    {
      id: 2,
      title: "Зарцуул",
      description: "Та цуглуулсан оноогоо худалдан авалтдаа зарцуулаарай",
      icon: require("./src/assets/onboard2.jpg"),
    },
    {
      id: 3,
      title: "Хуваалц",
      description: "Та найздаа цуглуулсан оноогоо бэлэглээрэй",
      icon: require("./src/assets/onboard3.webp"),
    },
    {
      id: 4,
      title: "Хязгааргүй",
      description:
        "Өшөө илүү олон боломжуудыг аваарай. Хадгаламж, Хувааж төлөх, Зээл",
      icon: require("./src/assets/onboard4.jpg"),
    },
  ];
  if (!fontsLoaded) {
    return null;
  }
  return (
    <NativeBaseProvider>
      <ThemeProvider value={themeName}>
        <AlertNotificationRoot>
          <SafeAreaProvider>
            <StateProvider>
              <Provider>
                <StatusBar barStyle="dark-content" />
                <NavigationContainer>
                  {isLoading !== true ? (
                    <FlatBoard
                      variant="modern"
                      data={data}
                      onFinish={handleFinish}
                      accentColor="#6172F3"
                      buttonTitle="Дахин харуулахгүй!"
                      headingStyles={{
                        fontSize: 24,
                        color: "#6172F3",
                        textAlign: "center",
                      }}
                    />
                  ) : (
                    <StackScreen />
                  )}
                </NavigationContainer>
              </Provider>
            </StateProvider>
          </SafeAreaProvider>
        </AlertNotificationRoot>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}
