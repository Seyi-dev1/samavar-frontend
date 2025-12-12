import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
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
      <View style={!focused?{ width:65, height:35,  borderRadius:20, justifyContent:'center', alignItems:'center'}:{backgroundColor:"#e5eafdff", width:65, height:35,  borderRadius:20, justifyContent:'center', alignItems:'center'}}>
        <Ionicons
        name={icon}
        color={focused ? "#7f72f5ff" : "#5c5c5cff"}
        size={22}
      />
      </View>
      
      <Text
        style={[
          focused
            ? { fontWeight: "700", color:'#3c3b3bff' }
            : { fontWeight:'500', color:'#484747ff'},
          { fontSize: 13, textAlign: "center", marginTop: 5, width: "100%" },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const HomeLayout2 = () => {
  return (
   <Tabs screenOptions={{tabBarShowLabel:false, tabBarStyle:{ elevation:5, height:80,  }}}>
      <Tabs.Screen
        name= 'chats'
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={focused?"chatbubble-ellipses":"chatbubble-ellipses-outline"} title={"Chats"} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name= 'calls'
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={focused?"call":'call-outline'} title={"Calls"} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name= 'stories'
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={focused?"paper-plane":'paper-plane-outline'} title={"Stories"} />
          ),
          headerShown: false,
        }}
      />
   </Tabs>
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
