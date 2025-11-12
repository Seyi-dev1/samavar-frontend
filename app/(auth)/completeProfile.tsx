import { avatars } from "@/assets/avatars/avatars";
import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<Names>({
    firstName: "",
    lastName: "",
  });

  const [selectPictureModal, setSelectPictureModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const onChangeFirstName = (text: string) => {
    setNames((prev) => {
      return { ...prev, firstName: text };
    });
  };

  const onChangeLastName = (text: string) => {
    setNames((prev) => {
      return { ...prev, lastName: text };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.heading}>Set Up Your Profile</Text>
        <Text style={styles.description}>
          Profiles are visible to people you message, contacts and groups.
        </Text>
        <View style={styles.profile}>
          <View style={styles.image}>
            <Octicons
              name="person"
              size={30}
              color={"#8c2dcbff"}
              style={{ fontWeight: 200 }}
            />
            <TouchableOpacity
              onPress={() => setSelectPictureModal(true)}
              style={styles.camera}
            >
              <Feather name="camera" size={18} color={"#000"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Samuel Oluwaseyi</Text>
        </View>
        <View style={styles.names}>
          <TextInput
            style={styles.nameInput}
            value={names.firstName}
            onChangeText={onChangeFirstName}
            placeholder="First name"
          />
          <TextInput
            style={styles.nameInput}
            value={names.lastName}
            onChangeText={onChangeLastName}
            placeholder="Last name"
          />
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={[styles.continueButton, { paddingVertical: loading ? 5 : 15 }]}
        >
          {loading ? (
            <ActivityIndicator size={38} color={"#fff"} />
          ) : (
            <Text>Save</Text>
          )}
        </TouchableOpacity>
      </View>
      {selectPictureModal && (
        <View style={styles.selectPictureModal}>
          <View>
            <AntDesign
              style={{ marginLeft: 25 }}
              name="close"
              size={22}
              color={"#2a2a2aff"}
              onPress={() => setSelectPictureModal(false)}
            />
            <View style={{ alignItems: "center", marginTop: 20 }}>
              {selectedImage === null ? (
                <View style={styles.noImage}>
                  <Octicons
                    name="person"
                    size={35}
                    color={"#8c2dcbff"}
                    style={{ fontWeight: 200 }}
                  />
                </View>
              ) : (
                <View style={styles.selectedImage}>
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={avatars[selectedImage]}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={styles.removeImage}
                  >
                    <AntDesign name="close" size={16} color={"#000"} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.selectOptions}>
              <TouchableOpacity style={{ alignItems: "center", gap: 10 }}>
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

              <TouchableOpacity style={{ alignItems: "center", gap: 10 }}>
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
                    <TouchableOpacity onPress={() => setSelectedImage(index)}>
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
                ItemSeparatorComponent={() => (
                  <View style={{ height: 30 }}></View>
                )}
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                { paddingVertical: loading ? 5 : 15 },
              ]}
            >
              {loading ? (
                <ActivityIndicator size={38} color={"#fff"} />
              ) : (
                <Text>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    backgroundColor: "#e2e1fbff",
    padding: 20,
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
