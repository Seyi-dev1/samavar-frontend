
import ChatsProvider from "@/context/chatsContext";
import TempUserProvider from "@/context/tempUserContext";
import UserProvider from "@/context/userContext";
import { migrate } from "@/db/migrate";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";


export const socket: Socket = io("http://10.145.52.87:3000", {
  transports: ["websocket"], // IMPORTANT for RN
  autoConnect: false,
});




export default function RootLayout() {
  socket.connect()

  socket.on("connect", () => {
  // console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  // console.log("❌ Socket connection error:", err.message);
});


  useEffect(() => {
  migrate();
  console.log('db created👍🏽')
}, []);
  return (
    <UserProvider>
      <TempUserProvider>
        <ChatsProvider>
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
        </ChatsProvider>
      </TempUserProvider>
    </UserProvider>
  );
}
