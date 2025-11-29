import { useTempUserContext } from "@/context/tempUserContext";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CameraPage = () => {
  const { updateTempUser, tempUser } = useTempUserContext();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      updateTempUser({ profilePhoto: uri, avatarIndex: undefined });
      console.log(tempUser.profilePhoto);
      router.replace("/(auth)/selectImage");
    }
  };

  const requestPermision = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
      // Automatically launch camera once permission is granted
      await takePhoto();
    } else {
      setHasPermission(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.askPermission}>
        <Image
          source={require("../../assets/icons/photo-camera.png")}
          style={{ width: 80, height: 80 }}
        />
        <Text
          style={{ paddingHorizontal: 30, textAlign: "center", fontSize: 16 }}
        >
          To capture photos and videos, allow Samavar access to the camera.
        </Text>
        <TouchableOpacity
          onPress={requestPermision}
          style={{
            padding: 12,
            backgroundColor: "#93b5d1ff",
            borderRadius: 10,
            paddingHorizontal: 30,
            marginTop: 15,
          }}
        >
          <Text>Allow Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <Redirect href={"/(auth)/selectImage"} />;
};

export default CameraPage;

const styles = StyleSheet.create({
  askPermission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
