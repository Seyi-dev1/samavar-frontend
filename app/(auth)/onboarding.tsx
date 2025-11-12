import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const Onboarding = () => {
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/images/onboardingImage.png")}
          style={{
            width: width * 0.9,
            aspectRatio: 1,
            height: height * 0.4,
            // resizeMode: "contain",
          }}
        />
      </View>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 25,
            fontWeight: "500",
            paddingHorizontal: 50,
            lineHeight: 35,
            color: "#222222ff",
          }}
        >
          Where every chat starts something new and exciting!
        </Text>
      </View>
      <View>
        <Text style={{ color: "#4c4c4cff" }}>Terms and Privacy Policy</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={styles.continueButton}
      >
        <Text>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  onboardingText: {
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#93b5d1ff",
    paddingVertical: 15,
    paddingHorizontal: 140,
    borderRadius: 30,
  },
});
