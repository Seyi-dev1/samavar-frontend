import TempUserProvider from "@/context/tempUserContext";
import UserProvider from "@/context/userContext";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <UserProvider>
      <TempUserProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor:"#fff"
          }}
          edges={["top", "left", "right"]}
        >
          <StatusBar
            style="auto"
          />
          <Slot/>
        </SafeAreaView>
      </TempUserProvider>
    </UserProvider>
  );
}
