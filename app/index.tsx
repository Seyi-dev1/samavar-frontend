import { useUserContext } from "@/context/userContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const {loading, user} = useUserContext()

  return loading? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={30} color={"#7f72f5ff"}/>
    </View>
  ): user? <Redirect href={'/(home)/(tabs)/chats'}/>:
  <Redirect href={'/(auth)/onboarding'}/>
  
  
}
