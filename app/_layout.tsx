import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor: colorScheme === "dark" ? "#1c1c1cff" : "#fff",
      }}
      edges={["top"]}
    >
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={"red"}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#1c1c1cff" : "#fff",
          },
        }}
      ></Stack>
    </SafeAreaView>
  );
}
