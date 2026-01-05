import { Stack } from "expo-router";
import { View } from "react-native";

export default function HomeLayout() {
  return (
    <View style={{flex:1,}}>
      <Stack
      screenOptions={{
        headerShown: false,
        contentStyle:{backgroundColor:"#fff"}
      }}
    ></Stack>
    </View>
    
  );
}
