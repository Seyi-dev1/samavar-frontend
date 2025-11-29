import { useTempUserContext } from "@/context/tempUserContext";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GalleryScreen = () => {
  const { updateTempUser, tempUser } = useTempUserContext();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      updateTempUser({ profilePhoto: uri, avatarIndex: undefined });
      console.log(tempUser.profilePhoto);
      router.replace("/(auth)/selectImage");
    }
  };

  const requestPermision = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
      // Automatically launch camera once permission is granted
      await selectImage();
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
          To choose an image, allow Samavar access to the gallery.
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

export default GalleryScreen;

const styles = StyleSheet.create({
  askPermission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
