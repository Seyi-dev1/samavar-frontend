import { avatars } from "@/assets/avatars/avatars";
import { useTempUserContext } from "@/context/tempUserContext";
import { useUserContext } from "@/context/userContext";
import { httpUpdaterUser } from "@/requests";
import { Feather, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export type Names = {
  firstName: string;
  lastName: string;
};

const CompleteProfile = () => {
  const { tempUser, updateTempUser } = useTempUserContext();
  const {user, updateUser} = useUserContext();
  console.log(tempUser);
  const [loading, setLoading] = useState(false);

  const onChangeFirstName = (text: string) => {
    const cleanedText = text.replace(/\s+/g, "");
    updateTempUser({ firstName: cleanedText });
  };

  const onChangeLastName = (text: string) => {
    const cleanedText = text.replace(/\s+/g, "");
    updateTempUser({ lastName: cleanedText });
  };

  const updateNewUser = async () => {
    try {
      if (!tempUser.phoneNumber || !tempUser.firstName || !tempUser.lastName) {
        alert("please fill empty fields");
        return;
      }
      const response = await httpUpdaterUser({
        phoneNumber: tempUser.phoneNumber,
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        profilePhoto: tempUser.profilePhoto,
        avatarIndex: tempUser.avatarIndex,
      });

      console.log('updated User',response?.data);
      updateUser({
        firstName:response?.data.firstName,
        lastName:response?.data.lastName,
        profilePhoto:response?.data.profilePhoto,
        avatarIndex:response?.data.avatarIndex,
        phoneNumber:response?.data.phone,
      })
      router.replace('/(home)/(tabs)/chats')
    } catch (error) {
      setLoading(false);
      alert("An error occurred while signing up user.");
      console.error("Error in registration:", error);
      return;
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.heading}>Set Up Your Profile</Text>
        <Text style={styles.description}>
          Profiles are visible to people you message, contacts and groups.
        </Text>
        <View style={styles.profile}>
          <View
            style={[
              styles.image,
              {
                padding:
                  (user?.avatarIndex !== undefined &&
                    user?.avatarIndex !== null &&
                    user?.avatarIndex >= 0) ||
                  user?.profilePhoto
                    ? 0
                    : 27,
              },
            ]}
          >
            {(user?.avatarIndex !== undefined &&
              user?.avatarIndex !== null &&
              user.avatarIndex >= 0) ||
            user?.profilePhoto ? (
              <Image
                style={{ width: 80, height: 80, borderRadius: 40 }}
                source={
                  user.avatarIndex !== undefined &&
                  user.avatarIndex !== null &&
                  user.avatarIndex >= 0
                    ? avatars[user.avatarIndex]
                    : { uri: user.profilePhoto }
                }
              />
            ) : (
              <Octicons
                name="person"
                size={30}
                color={"#5b9babff"}
                style={{ fontWeight: 200 }}
              />
            )}

            <TouchableOpacity
              onPress={() => router.push("/(auth)/selectImage")}
              style={styles.camera}
            >
              <Feather name="camera" size={18} color={"#000"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>
            {tempUser.firstName && tempUser.firstName}
            <Text> </Text>
            {tempUser.lastName && tempUser.lastName}
          </Text>
        </View>
        <View style={styles.names}>
          <TextInput
            style={styles.nameInput}
            value={tempUser.firstName}
            onChangeText={onChangeFirstName}
            placeholder="First name"
          />
          <TextInput
            style={styles.nameInput}
            value={tempUser.lastName}
            onChangeText={onChangeLastName}
            placeholder="Last name"
          />
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={[styles.continueButton, { paddingVertical: loading ? 5 : 15 }]}
          onPress={updateNewUser}
        >
          {loading ? (
            <ActivityIndicator size={38} color={"#fff"} />
          ) : (
            <Text>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    flex: 1,
    justifyContent: "space-between",
  },

  heading: {
    fontWeight: 500,
    fontSize: 22,
  },
  top: {
    gap: 20,
  },
  continueButton: {
    backgroundColor: "#93b5d1ff",
    paddingHorizontal: 140,
    borderRadius: 30,
    alignItems: "center",
  },

  description: {
    color: "#4c4b4bff",
    fontSize: 15,
  },

  profile: {
    alignItems: "center",
    gap: 10,
  },

  image: {
    backgroundColor: "#d2e9f7ff",
    borderRadius: "50%",
  },

  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ffffffff",
    padding: 8,
    borderRadius: "50%",
    elevation: 5,
  },
  name: {
    fontSize: 16,
  },

  names: {
    gap: 20,
  },

  nameInput: {
    paddingVertical: 17,
    paddingHorizontal: 12,
    backgroundColor: "#eae9e9ff",
    borderRadius: 8,
  },

  selectPictureModal: {
    width: width,
    height: height,
    backgroundColor: "#fff",
    position: "absolute",
    paddingTop: 25,
    paddingBottom: 70,
    justifyContent: "space-between",
  },

  noImage: {
    backgroundColor: "#e2e1fbff",
    padding: 57,
    borderRadius: "50%",
  },

  selectedImage: {
    position: "relative",
  },

  removeImage: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ffffffff",
    padding: 15,
    borderRadius: "50%",
    elevation: 5,
  },

  selectOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginTop: 30,
  },

  selectOption: {
    backgroundColor: "#dce9faff",
    padding: 18,
    borderRadius: 15,
  },
});
