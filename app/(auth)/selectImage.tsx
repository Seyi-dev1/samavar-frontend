import { avatars } from "@/assets/avatars/avatars";
import { useTempUserContext } from "@/context/tempUserContext";
import { useUserContext } from "@/context/userContext";
import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SelectImage = () => {
  const { tempUser, updateTempUser } = useTempUserContext();
  console.log(tempUser);
  const {user, updateUser} = useUserContext();
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.selectPictureModal}>
      <AntDesign onPress={()=>{
        // updateTempUser({avatarIndex: user?.avatarIndex, profilePhoto: user?.profilePhoto})
        router.replace('/(auth)/completeProfile')
      }
        
        } name="close" size={22} color={"#000"} style={{paddingLeft:20}} />
      <View>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          {(tempUser.avatarIndex !== undefined && tempUser.avatarIndex !==null && tempUser.avatarIndex >= 0) ||
          tempUser.profilePhoto ? (
            <View style={styles.selectedImage}>
              <Image
                style={{ width: 150, height: 150, borderRadius: 75 }}
                source={
                  tempUser.avatarIndex !== null && tempUser.avatarIndex !== undefined &&
                  tempUser.avatarIndex >= 0
                    ? avatars[tempUser.avatarIndex]
                    : { uri: tempUser.profilePhoto }
                }
              />
              <TouchableOpacity
                onPress={() =>{
                  updateTempUser({
                    avatarIndex: null,
                    profilePhoto: null,
                  })
                  updateUser({
                    avatarIndex: null,
                    profilePhoto: null,
                  })
                }
                  
                }
                style={styles.removeImage}
              >
                <AntDesign name="close" size={16} color={"#000"} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noImage}>
              <Octicons
                name="person"
                size={35}
                color={"#5b9babff"}
                style={{ fontWeight: 200 }}
              />
            </View>
          )}
        </View>
        <View style={styles.selectOptions}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/cameraPage")}
            style={{ alignItems: "center", gap: 10 }}
          >
            <View style={styles.selectOption}>
              <Feather
                name="camera"
                size={23}
                color={"#1a1a1bff"}
                style={{ fontWeight: 200 }}
              />
            </View>
            <Text>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/galleryScreen")}
            style={{ alignItems: "center", gap: 10 }}
          >
            <View style={styles.selectOption}>
              <Ionicons
                name="image"
                size={23}
                color={"#1b1a1cff"}
                style={{ fontWeight: 200 }}
              />
            </View>
            <Text>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: "center", gap: 10 }}>
            <View style={styles.selectOption}>
              <Ionicons
                name="text"
                size={23}
                color={"#191819ff"}
                style={{ fontWeight: 200 }}
              />
            </View>
            <Text>Text</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ backgroundColor: "#dfdfdfff", height: 1, marginTop: 20 }}
        ></View>
        <View>
          <FlatList
            data={avatars}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{
                    borderWidth: 3,
                    borderRadius: "50%",
                    borderColor:
                      index === tempUser.avatarIndex
                        ? "#5b9babff"
                        : "transparent",
                  }}
                  onPress={() =>
                    updateTempUser({
                      avatarIndex: index,
                      profilePhoto: undefined,
                    })
                  }
                >
                  <Image source={item} style={{ width: 70, height: 70 }} />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item}
            numColumns={4}
            contentContainerStyle={{
              paddingHorizontal: 16,
              marginTop: 40,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
              gap: 20,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 30 }}></View>}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity
          onPress={() => {
            updateUser({profilePhoto: tempUser.profilePhoto, avatarIndex:tempUser.avatarIndex})
            router.replace("/(auth)/completeProfile")
          }}
          style={[styles.continueButton, { paddingVertical: loading ? 5 : 15 }]}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectImage;

const styles = StyleSheet.create({
  selectPictureModal: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 25,
    paddingBottom: 20,
    justifyContent: "space-between",
  },

  noImage: {
    backgroundColor: "#e2e1fbff",
    padding: 57,
    borderRadius: "50%",
    borderWidth: 5,
    borderColor: "#5b9babff",
  },

  selectedImage: {
    position: "relative",
    borderWidth: 5,
    borderColor: "#5b9babff",
    borderRadius: "50%",
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

  continueButton: {
    backgroundColor: "#93b5d1ff",
    paddingHorizontal: 140,
    borderRadius: 30,
    alignItems: "center",
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
