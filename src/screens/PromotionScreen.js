import React, { useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Linking,
} from "react-native";
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
  useToast,
  Center,
  Select,
  HStack,
  PresenceTransition,
  AlertDialog,
  Pressable,
  Spacer,
  Flex,
  Badge,
  CheckIcon,
} from "native-base";
import InstaStory from "react-native-insta-story";
import { WebView } from "react-native-webview";

const data = [
  {
    user_id: 1,
    user_image:
      "https://cdn3.shoppy.mn/stores/5273/medium/mijin-cosmetics-kh.jpg",
    user_name: "Brand 1",
    stories: [
      {
        story_id: 1,
        story_image:
          "https://i.pinimg.com/originals/f6/b5/03/f6b503a7660c81f9db2a47ae2a483110.jpg",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 1 swiped"),
      },
      {
        story_id: 2,
        story_image:
          "https://i.pinimg.com/originals/43/61/b8/4361b8ba59a2ce008c976915c622168d.jpg",
      },
      {
        story_id: 3,
        story_image:
          "https://i.pinimg.com/originals/05/52/4b/05524bef814dddee5b6adb8efe0ea073.jpg",
      },
    ],
  },
  {
    user_id: 2,
    user_image:
      "https://cdn3.shoppy.mn/stores/5219/medium/pinky-cosmetic-har.jpg",
    user_name: "Brand 2",
    stories: [
      {
        story_id: 1,
        story_image:
          "https://i.pinimg.com/originals/05/52/4b/05524bef814dddee5b6adb8efe0ea073.jpg",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 1 swiped"),
      },
      {
        story_id: 2,
        story_image:
          "https://www.superga-usa.com/cdn/shop/files/2.15_1080x1920_copy.jpg?v=1707784664&width=1080",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 2 swiped"),
      },
    ],
  },
  {
    user_id: 3,
    user_image: "https://cdn3.shoppy.mn/stores/5321/medium/images-_1_.jpg",
    user_name: "Brand 3",
    stories: [
      {
        story_id: 1,
        story_image:
          "https://goclove.com/cdn/shop/files/Homepage-Takeover-Mobile_7c09be40-1a15-4c63-a99b-a23c8f2b52ec.jpg?v=1711133890",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 1 swiped"),
      },
      {
        story_id: 2,
        story_image:
          "https://fiorentini-baker.com/cdn/shop/files/Fiorentini_Baker-Made-in-Italy-Made-to-Last-Spring24-1080_1920B.jpg",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 2 swiped"),
      },
    ],
  },

  {
    user_id: 4,
    user_image: "https://cdn3.shoppy.mn/stores/5318/medium/ottie_white.jpg",
    user_name: "Brand 4",
    stories: [
      {
        story_id: 1,
        story_image:
          "https://imerikamarie.com/wp-content/uploads/2023/09/best-fall-shoes-1.png",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 1 swiped"),
      },
      {
        story_id: 2,
        story_image:
          "https://images.squarespace-cdn.com/content/v1/5cab8f9ea09a7e53a9347eed/b796f3b7-2d94-4a33-8ec2-d16ab34e1715/LS-1080x1920.jpg",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 2 swiped"),
      },
    ],
  },
  {
    user_id: 5,
    user_image: "https://cdn3.shoppy.mn/stores/319/medium/basconi1.png",
    user_name: "Brand 5",
    stories: [
      {
        story_id: 1,
        story_image:
          "https://scontent.fuln6-1.fna.fbcdn.net/v/t39.30808-6/433192555_1788622954953324_3198407612124645795_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=V3ul3K_0UCQAX_cOYbn&_nc_ht=scontent.fuln6-1.fna&oh=00_AfAJp0-0_WQhOWI7WBvwjP-IlVpmWg2W58klrb9CeR3_9g&oe=6604D3D7",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 1 swiped"),
      },
      {
        story_id: 2,
        story_image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvWWfDEH_FbJmQ74Feped-pMy8O-3lt3UGI26HMCSLUw&s",
        swipeText: "Custom swipe text for this story",
        onPress: () => console.log("story 2 swiped"),
      },
    ],
  },
];
const { width, height } = Dimensions.get("window");

const injectJavaScript = `
    const video = document.getElementsByTagName('video')[0];
    video.controls = false;
    video.loop = true;
  `;

const PromotionScreen = () => {
  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={"#EBEDF0"} />

      <ScrollView>
        <Box backgroundColor={"#EBEDF0"}>
          <Box>
            <Text
              color={"#2851A3"}
              marginTop={3}
              paddingLeft={4}
              bold
              fontSize={20}
            >
              Story
            </Text>
          </Box>
          <InstaStory
            data={data}
            duration={10}
            pressedBorderColor="#606770"
            pressedAvatarTextColor="#606770"
            unPressedBorderColor="#77A7FF"
            unPressedAvatarTextColor="#2851A3"
          />
        </Box>
        <Box backgroundColor={"#EBEDF0"} width={"100%"} h={"650"}>
          <WebView
            injectedJavaScript={injectJavaScript}
            javaScriptEnabled={true}
            source={{
              style: {
                justifyContent: "flex-start",
                width: "100%",
                backgroundColor: "#EBEDF0",
              },
              uri: "https://www.apple.com//105/media/us/iphone/family/2024/1efec3e0-8619-4684-a57e-6e2310394f08/anim/welcome/small_2x.mp4#t=1.893576",
            }}
          />
        </Box>
        <Center py={3} px="3">
          <Pressable
            width={"90%"}
            onPress={() => {
              if (Platform.OS === "android") {
                Linking.openURL(`https://next.mn/promotion`);
              } else {
                Linking.openURL(`https://next.mn/promotion`);
              }
            }}
          >
            {({ isHovered, isFocused, isPressed }) => {
              return (
                <Box
                  maxW="96"
                  borderWidth="1"
                  borderColor="coolGray.300"
                  shadow="3"
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  p="5"
                  rounded="8"
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                >
                  <HStack alignItems="center">
                    <Badge
                      colorScheme="darkBlue"
                      _text={{
                        color: "white",
                      }}
                      variant="solid"
                      rounded="4"
                    >
                      Сурталчилгаа
                    </Badge>
                    <Spacer />
                    <Text fontSize={10} color="coolGray.800">
                      1 Hour ago
                    </Text>
                  </HStack>
                  <Text
                    color="coolGray.800"
                    mt="3"
                    fontWeight="medium"
                    fontSize="md"
                    bold
                  >
                    Next Expo - Ялалтын талбайд
                  </Text>
                  <Text mt="2" fontSize="sm" color="coolGray.700">
                    <Text bold color={"red.600"}>
                      Next electronics
                    </Text>{" "}
                    дэлгүүр бүх цахилгаан бараанууд 10-20% хямдарлаа
                  </Text>
                  <Flex>
                    {isFocused ? (
                      <Text
                        mt="2"
                        fontSize={12}
                        fontWeight="medium"
                        textDecorationLine="underline"
                        color="darkBlue.600"
                        alignSelf="flex-start"
                      >
                        Read More
                      </Text>
                    ) : (
                      <Text
                        mt="2"
                        fontSize={12}
                        fontWeight="medium"
                        color="darkBlue.600"
                      >
                        Цааш унших
                      </Text>
                    )}
                  </Flex>
                </Box>
              );
            }}
          </Pressable>
        </Center>
      </ScrollView>
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

export default PromotionScreen;
