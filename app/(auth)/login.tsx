import { countries } from "@/assets/data/coutriesData";
import { sendVerificationCode, verifyCode } from "@/requests";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export type Country = {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
};

const Login = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Nigeria",
    dial_code: "234",
    code: "NG",
    flag: "🇳🇬",
  });

  const [phase, setPhase] = useState<"input" | "verify">("input");

  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [selectCountryModal, setSelectCountryModal] = useState(false);

  const handleCountryCodeChange = (text: string) => {
    // Keep only digits
    const cleanedText = text.replace(/[^0-9]/g, "");
    setSelectedCountry((prev) => ({ ...prev, dial_code: cleanedText }));
  };

  const handlePhoneNumberChange = (text: string) => {
    // Keep only digits
    const cleanedText = text.replace(/[^0-9]/g, "");
    const phoneNumberText = parsePhoneNumberFromString(
      cleanedText,
      selectedCountry.code as CountryCode
    );
    console.log(phoneNumberText?.formatInternational().replace(/\s+/g, ""));
    setPhoneNumber(
      phoneNumberText ? phoneNumberText.formatNational() : cleanedText
    );
  };

  const handlePhoneNumberSubmit = async () => {
    setLoading(true);
    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, "");
      const phoneNumberText = parsePhoneNumberFromString(
        cleanedPhoneNumber,
        selectedCountry.code as CountryCode
      )
        ?.formatInternational()
        .replace(/\s+/g, "");
      console.log("Submitted Phone Number:", phoneNumberText);
      if (!phoneNumberText) {
        console.log("invalid phone number");
        setLoading(false);
        alert("Please enter a valid phone number");

        return;
      }
      const response = await sendVerificationCode(phoneNumberText);
      console.log("Response from sendVerificationCode:", response.data);
      if (response.data?.status === "pending") {
        setPhase("verify");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("An error occurred while sending the verification code.");
      console.error("Error in handlePhoneNumberSubmit:", error);
      return;
    }
  };

  //input box logic
  const length = 6;
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  console.log("code", code.join(""));

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;

    setCode(newCode);

    // Move to next input automatically
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Optionally, move back if user clears
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleCodeSubmit = async () => {
    setLoading(true);
    const verificationCode = code.join("");
    const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, "");
    const phoneNumberText = parsePhoneNumberFromString(
      cleanedPhoneNumber,
      selectedCountry.code as CountryCode
    )
      ?.formatInternational()
      .replace(/\s+/g, "");
    console.log("Submitted Phone Number for verification:", phoneNumberText);
    if (verificationCode.length < length) {
      setLoading(false);
      alert("Please enter the complete verification code.");
      return;
    }
    try {
      const response = await verifyCode(phoneNumberText!, verificationCode);
      console.log("Response from verifyCode:", response.data);
      setLoading(false);
      router.push("/(auth)/completeProfile");
    } catch (error) {
      setLoading(false);
      alert("An error occurred while verifying the code.");
      console.error("Error in handleCodeSubmit:", error);
      return;
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (selectCountryModal) {
        setSelectCountryModal(false);
        return true; // prevent default behavior (exit app)
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    // return () => backHandler.remove(); // cleanup when component unmounts
  }, []);

  return phase === "input" ? (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.header}>Phone number</Text>
        <Text style={styles.description}>
          You will recieve a verification code. Carrier rates may apply.
        </Text>
        <View style={styles.form}>
          <TouchableOpacity
            onPress={() => setSelectCountryModal(true)}
            style={styles.countryContainer}
          >
            <View style={styles.flagAndCountry}>
              <Text style={{ fontSize: 20 }}>{selectedCountry.flag}</Text>
              <Text style={{ fontSize: 16 }}>{selectedCountry.name}</Text>
            </View>
            <MaterialIcons name="arrow-drop-down" size={30} color={"#000"} />
          </TouchableOpacity>
          <View style={styles.phoneNumberContainer}>
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.countryCodeInput}
                keyboardType="phone-pad"
                value={selectedCountry.dial_code}
                onChangeText={handleCountryCodeChange}
                placeholder="0"
                maxLength={3}
              />
              <Text
                style={{
                  position: "absolute",
                  bottom: "26%",
                  left: 10,
                  fontSize: 20,
                  color: "#727272ff",
                }}
              >
                +
              </Text>
            </View>

            <TextInput
              style={styles.phoneNumberInput}
              keyboardType="phone-pad"
              value={phoneNumber}
              placeholder="Phone Number"
              onChangeText={handlePhoneNumberChange}
              maxLength={15}
            />
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={handlePhoneNumberSubmit}
          style={[styles.continueButton, { paddingVertical: loading ? 5 : 15 }]}
        >
          {loading ? (
            <ActivityIndicator size={38} color={"#fff"} />
          ) : (
            <Text>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
      {selectCountryModal && (
        <View style={styles.selectCountryModal}>
          <View style={styles.modalHeader}>
            <Ionicons
              onPress={() => setSelectCountryModal(false)}
              name="arrow-back"
              size={25}
            />
            <Text style={{ fontSize: 20 }}>Select Country</Text>
          </View>
          <FlatList
            style={styles.countryList}
            data={countries}
            keyExtractor={(item) => item.name}
            renderItem={({ item }: { item: Country }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCountry({
                      ...item,
                      dial_code: item.dial_code.substring(1),
                    });
                    setSelectCountryModal(false);
                  }}
                  style={styles.countryItem}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 40,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{item.flag}</Text>
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </View>
                  <Text style={{ fontSize: 16, color: "#727272ff" }}>
                    {item.dial_code}
                  </Text>
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.header}>Verify Code</Text>
        <Text style={styles.description}>
          Please enter the verification we sent to your phone number below.
        </Text>
        <View style={styles.formForCode}>
          <View style={styles.inputsContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[
                  styles.input,
                  digit ? styles.filledInput : null,
                  inputs.current[index]?.isFocused?.()
                    ? styles.activeInput
                    : null,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleCodeSubmit}
          style={[styles.continueButton, { paddingVertical: loading ? 5 : 15 }]}
        >
          {loading ? (
            <ActivityIndicator size={38} color={"#fff"} />
          ) : (
            <Text>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 30,
    position: "relative",
  },
  top: {
    gap: 20,
  },
  header: {
    fontWeight: 500,
    fontSize: 22,
  },
  description: {
    color: "#5b5b5bff",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#93b5d1ff",
    paddingHorizontal: 140,
    borderRadius: 30,
  },

  form: {
    gap: 20,
  },

  countryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: "#d5dadcff",
    borderRadius: 10,
  },
  flagAndCountry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  phoneNumberContainer: {
    flexDirection: "row",
    gap: 30,
  },
  countryCodeInput: {
    backgroundColor: "#d5dadcff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontWeight: "500",
    fontSize: 16,
    minWidth: 65,
  },
  phoneNumberInput: {
    flex: 1,
    backgroundColor: "#d5dadcff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  selectCountryModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    width: width,
    height: height,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 70,
    // zIndex: 23,
  },

  modalHeader: {
    flexDirection: "row",
    gap: 80,
    alignItems: "center",
    paddingBottom: 30,
  },

  countryList: {
    gap: 30,
    paddingTop: 10,
    paddingBottom: 200,
  },

  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },

  formForCode: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  codeInput: {
    backgroundColor: "#bcccd3ff",
    textAlign: "center",
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 7,
    textAlign: "center",
    fontSize: 22,
    color: "#333",
    backgroundColor: "#e5f3f7ff",
  },
  filledInput: {
    borderColor: "#9abc9bff",
  },
  activeInput: {
    borderColor: "#87a4c3ff",
    // shadowColor: "#007BFF",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  codeText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});
