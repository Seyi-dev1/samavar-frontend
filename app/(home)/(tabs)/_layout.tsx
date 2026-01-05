import MyTabBar from "@/components/TabBar";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";




const HomeLayout2 = () => {
  return (
    <View style={{ flex: 1,  }}>
       <Tabs screenOptions={{sceneStyle:{backgroundColor:"#ffffffff", paddingHorizontal:20}}}  tabBar={(props)=> <MyTabBar {...props}/>}>
      <Tabs.Screen
        name= 'chats'
        options={{
          
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name= 'calls'
        options={{
          
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name= 'stories'
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name= 'profile'
        options={{
          headerShown: false,
        }}
      />
   </Tabs>
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

  icon: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height:35
  },
});
