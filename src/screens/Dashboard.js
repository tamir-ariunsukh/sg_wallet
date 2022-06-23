import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect, useContext } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  View,
  useToast,
  KeyboardAvoidingView,

} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard({ navigation }, props) {
  const successToast = useToast();
  const warnToast = useToast();
  const [userData, setUserData] = useContext(StateContext);
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);

  const [showModal, setShowModal] = useState(false);

  const [receiverOrder, setReceiverOrder] = useState({ value: "", error: "" });
  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    InternetCheck()
    userTransactionHistory()
    dataRefresher()
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const InternetCheck = () => {
    NetInfo.fetch().then((networkState) => {
      if (networkState.isConnected !== true) {
        warnToast.show({
          backgroundColor: "red.400",
          px: "2",
          py: "1",
          rounded: "sm",
          height: "50",
          width: "250",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          title: "Интэрнет холболт алга",
          placement: "top",
        });
      }
    });
  }
  const checkOut = () => {
    InternetCheck()
    const receiverPhoneError = phoneValidator(receiverPhone.value);
    const receiverAmountError = amountValidator(receiverAmount.value);

    if (receiverAmountError || receiverPhoneError) {
      setReceiverAmount({ ...receiverAmount, error: receiverAmountError });
      setReceiverPhone({ ...receiverPhone, error: receiverPhoneError });
      Alert.alert(
        "Та шилжүүлгийн мэдээллээ зөв оруулна уу",
        `Утасны дугаар зөвхөн 8 орноос бүрдэх ёстой. Үнийн дүн зөвхөн тоо агуулна.`,
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    }

    var request = JSON.stringify({
      fromPhone: userData.wallets.phone,
      toPhone: parseInt(receiverPhone.value),
      amount: parseInt(receiverAmount.value),
      summary: `Худалдан авалтын гүйлгээ`,
      id: userData.wallets._id,
      walletSuperId: userData.wallets.walletSuperId,
      OrderNumber: parseInt(receiverOrder.value),
    });

    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/purchase`,
      headers: {
        "Content-Type": "application/json",
      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          setReceiverPhone({ value: "", error: "" });
          setReceiverAmount({ value: "", error: "" });
          setReceiverOrder({ value: "", error: "" });
          userTransactionHistory();

          dataRefresher();
          successToast.show({
            backgroundColor: "emerald.400",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Гүйлгээ амжилттай",
            placement: "top",
          });
        } else {
          warnToast.show({
            backgroundColor: "red.400",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Гүйлгээ aмжилтгүй",
            placement: "top",
          });
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
        setReceiverAmount({ value: "", error: "" });
        setReceiverOrder({ value: "", error: "" });
        setReceiverPhone({ value: "", error: "" });
        if (err.status == 405) {
          Alert.alert("Дахин оролдоно уу", "Ямар нэгэн зүйл буруу байна.", [
            {
              text: "OK",
            },
          ]);
        }
        warnToast.show({
          backgroundColor: "red.400",
          px: "2",
          py: "1",
          rounded: "sm",
          height: "50",
          width: "250",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          title: "Гүйлгээ aмжилтгүй",
          placement: "top",
        });
      });
  };

  const dataRefresher = () => {
    InternetCheck()
    try {
      var requests = JSON.stringify({
        walletSuperId: userData.wallets.walletSuperId,
      });

      var configs = {
        method: "POST",
        url: `${baseUrl}/wallets/my/${userData.wallets._id}`,
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 0,
        data: requests,
      };
      axios(configs)
        .then(function (response) {
          userTransactionHistory();
          setUserData({
            token: userData.token,
            wallets: response.data.wallets,
          });
        })
        .catch(function (error) {
          warnToast.show({
            backgroundColor: "red.400",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Сервер түр унтарсан.",
            placement: "top",
          });
        });
    } catch (err) {
      {
      }
    }
  };

  const userTransactionHistory = () => {
    InternetCheck()
    var datas = JSON.stringify({
      walletSuperId: userData.wallets.walletSuperId,
    });

    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/wallet/${userData.wallets._id}`,
      headers: {
        "Content-Type": "application/json",
      },

      data: datas,
    };

    axios(config)
      .then((response) => {
        setUserTransactionData(response.data.data);
      })
      .catch((error) => {
        {
        }
      });
  };

  useEffect(() => {
    setShowModal(false);
    InternetCheck()
    userTransactionHistory();
    setUserTransactionData("");
    setReceiverOrder({ value: "", error: "" });
    setReceiverPhone({ value: "", error: "" });
    setReceiverAmount({
      value: "",
      error: "",
    });
  }, []);

  return (
    <NativeBaseProvider>
      <ScrollView
        VirtualizedList-backed
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <SafeAreaView>
          <View flex={1} alignSelf="center"
            alignItems="center" width={wp("100%")} paddingTop={hp("1%")} padding={wp("10%")} height={hp("99%")} backgroundColor="white">
            <View style={{ display: "flex" }}>
              <CartStyle />
              <View
                style={{
                  paddingTop: hp("0.5%"),
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: hp("10%"),
                  width: wp("95%"),
                }}
              >
                <VStack justifyContent="center" alignItems="center">
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <Button
                      colorScheme="orange"
                      shadow="5"
                      variant="subtle"
                      bg="#CC5801"
                      borderRadius={10}
                      height={"90%"}
                      marginRight={1}
                      flex={1}
                      success
                      onPress={() => {
                        setShowModal(true);
                      }}
                    >
                      <Text bold textAlign="center" fontSize="lg" color="white">
                        Худалдан
                      </Text>
                      <Text bold textAlign="center" fontSize="lg" color="white">
                        авалт
                      </Text>
                    </Button>
                    {showModal ? (
                      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <KeyboardAvoidingView
                          h={{
                            base: "400px",
                            lg: "auto",
                          }}
                          behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                          <Modal.Content width={wp("80%")} height={hp("60%")}>
                            <Modal.CloseButton />
                            <Modal.Header>
                              <Text
                                bold
                                color="#242B2E"
                                fontSize={20}
                                textAlign="center"
                              >
                                Төлбөр төлөх
                              </Text>
                            </Modal.Header>
                            <Modal.Body>
                              <FormControl>
                                <FormControl.Label>
                                  <Text
                                    fontSize={20}
                                    fontWeight="semibold"
                                    color="gray.700"
                                  >
                                    Хүлээн авагч
                                  </Text>
                                </FormControl.Label>

                                <View>
                                  <Box>
                                    <Input
                                      fontSize={20}
                                      returnKeyType="next"
                                      onChangeText={(receiverAmountPhone) =>
                                        setReceiverPhone({
                                          value: receiverAmountPhone,
                                          error: "",
                                        })
                                      }
                                      keyboardType="number-pad"
                                    />
                                  </Box>
                                </View>
                              </FormControl>

                              <FormControl.Label>
                                <Text
                                  fontSize={20}
                                  fontWeight="semibold"
                                  color="gray.700"
                                >
                                  Үнийн дүн
                                </Text>
                              </FormControl.Label>
                              <Box>
                                <Input
                                  fontSize={20}
                                  value={String(receiverAmount.value)}
                                  returnKeyType="next"
                                  onChangeText={(receiverAmountNumber) =>
                                    setReceiverAmount({
                                      value: receiverAmountNumber,
                                      error: "",
                                    })
                                  }
                                  keyboardType="number-pad"
                                />
                              </Box>

                              <FormControl.Label>
                                <Text
                                  fontSize={20}
                                  fontWeight="semibold"
                                  color="gray.700"
                                >
                                  Гүйлгээний утга
                                </Text>
                              </FormControl.Label>
                              <Box>
                                <Input
                                  fontSize={20}
                                  value={String(receiverOrder.value)}
                                  returnKeyType="done"
                                  onChangeText={(receiverSummeryNumber) =>
                                    setReceiverOrder({
                                      value: receiverSummeryNumber,
                                      error: "",
                                    })
                                  }
                                  keyboardType="number-pad"
                                />
                              </Box>
                              <Text fontSize={12} bold color="red.700">
                                Худалдааны зөвлөх танд тайлбарлах болно
                              </Text>
                            </Modal.Body>

                            <Modal.Footer>
                              <Button.Group space={5}>
                                <Button
                                  variant="ghost"
                                  colorScheme="blueGray"
                                  onPress={() => {
                                    setShowModal(false);
                                    setReceiverPhone({ value: "", error: "" });
                                    setReceiverAmount({
                                      value: "",
                                      error: "",
                                    });
                                  }}
                                >
                                  <Text bold color="#242B2E">
                                    Хаах
                                  </Text>
                                </Button>
                                <Button
                                  onPress={() => {
                                    setShowModal(false);
                                    checkOut();
                                  }}
                                >
                                  <Text bold color="white">
                                    Төлөх
                                  </Text>
                                </Button>
                              </Button.Group>
                            </Modal.Footer>
                          </Modal.Content>
                        </KeyboardAvoidingView>
                      </Modal>
                    ) : (
                      <View></View>
                    )}

                    <Button
                      shadow="5"
                      variant="subtle"
                      borderWidth={3}
                      bg="white"
                      colorScheme="brown"
                      borderColor="#CC5801"
                      borderRadius={10}
                      marginLeft={1}
                      height={"90%"}
                      flex={1}
                      bordered
                      success
                      onPress={() => {
                        warnToast.show({
                          backgroundColor: "red.400",
                          px: "2",
                          py: "1",
                          rounded: "sm",
                          height: "50",
                          width: "250",
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          title: "Тун удахгүй",
                          placement: "top",
                        });
                      }}
                    >
                      <Text bold fontSize="lg" color="#CC5801">
                        Цэнэглэлт
                      </Text>
                    </Button>
                  </View>
                </VStack>
                <View
                  style={{
                    width: "100%",

                    position: "absolute",
                    marginTop: hp("12%"),
                  }}
                  borderRadius="1"
                  borderBottomWidth="2"
                  borderBottomColor="gray.500"
                ></View>
                <View style={{ marginTop: hp("4%"), height: hp("3%") }}>
                  <Heading
                    textAlign="center"
                    size="sm"
                    color="#242B2E"
                    bgColor="red"
                  >
                    ШИНЭ ЗАГВАРУУД
                  </Heading>
                </View>

                <View
                  style={{
                    marginTop: hp("1%"),
                    width: wp("95%"),
                    height: hp("30%"),
                  }}
                >
                  <Product />
                </View>
                <View
                  style={{
                    width: wp("95%"),
                    height: hp("13%"),
                  }}
                >
                  <MyActionButtonComponent navigation={navigation} />
                </View>
                <Text
                  position="absolute"
                  height={wp("10%")}
                  width={wp("95%")}
                  mt={hp("55%")}
                  backgroundColor="red"
                  fontSize="md"
                  color="gray.700"
                  bold
                  textAlign="center"
                >
                  © 2022 Shoe Gallery Mongolia
                </Text>
              </View>
            </View>
          </View>

        </SafeAreaView >
      </ScrollView>

    </NativeBaseProvider >
  );
}
