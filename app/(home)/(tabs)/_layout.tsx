import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) => {
  return (
    <View style={styles.tabIconView}>
      <Ionicons
        name={"home"}
        tintColor={focused ? "#0061ff" : "#666876"}
        resizeMode="contain"
        style={{ width: 23, height: 23 }}
      />
      <Text
        style={[
          focused
            ? { fontFamily: "Rubik-Medium" }
            : { fontFamily: "Rubik-Regular" },
          { fontSize: 10, textAlign: "center", marginTop: 1, width: "100%" },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const HomeLayout2 = () => {
  return (
    <View>
      <Text>HomeLayout2</Text>
    </View>
  );
};

export default HomeLayout2;

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  tabIconView: {
    flex: 1,
    alignItems: "center",
    marginTop: 3,
    flexDirection: "column",
  },
});
