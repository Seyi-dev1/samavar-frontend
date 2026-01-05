import { socket } from "@/app/_layout";
import { db } from "@/db/client";
import { chats, messages } from "@/db/schema";
import { httpFetchChats } from "@/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eq } from "drizzle-orm";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Chat = {
    id: string;
    participantId: string;
    lastMessage?: string;
    lastMessageAt?: number;
    unreadCount?: number;
}

export type ChatContextType = {
    userChats: Chat[] | null;
    activeChat: Chat | null;
    setActiveChat: (value: Chat | null) => void;
    setUserChats: (value: Chat[] | null) => void; 
}



export const ChatsContext = createContext<ChatContextType | undefined>(undefined);

 const ChatsProvider = ({ children }:{children:React.ReactNode}) => {
    const [userChats, setUserChats] = useState<Chat[] | null>(null);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);

    const fetchChats = async () => {
        try {
            const response = await httpFetchChats();
            setUserChats(Array.isArray(response) ? response : response.data);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    useEffect(()=> {
    fetchChats();
    }, [])

    useEffect(()=> {
        // alert for message sender that message has been sent
        socket.on('messageSent', async ({chatId, messageId, status, deliveredAt, seenAt})=> {
            console.log('messageSent received in ChatsContext', {chatId, messageId, status});
            await db.update(messages)
        .set({ status: status, deliveredAt:deliveredAt, seenAt:seenAt })
        .where(eq(messages.messageId, messageId));

        await db.update(chats)
        .set({ lastMessageStatus: status })
        .where(eq(chats.id, chatId));

       await AsyncStorage.setItem('lastSyncedAt', new Date().toISOString());

        fetchChats();
        })  
        
        // alert for message receiver that new message has been received
        socket.on('newMessage', async (message)=> {
            console.log('newMessage received in ChatsContext', message);
            // save message locally
            await db.insert(messages).values({...message, status:'delivered', deliveredAt:message.deliveredAt, seenAt:message.seenAt});
            console.log('new message saved locally');
            // update chats list
             const existing = await db
    .select()
    .from(chats)
    .where(eq(chats.id, message.chatId))
    .limit(1);
    if (existing.length) {
        const chat = existing[0];

        await db
        .update(chats)
        .set({
          lastMessageAt: message.createdAt,
          lastMessage: message.content,
          lastMessageStatus: 'delivered',
          unreadCount: chat.unreadCount! + 1,
          lastMessageSenderId: message.senderId
        })
        .where(eq(chats.id, chat.id));
    }
    if (!existing.length) {
        const newChat = {
            id: message.chatId,
            participantId: message.senderId,
            lastMessage: message.content,
            lastMessageAt: message.createdAt,
            lastMessageStatus: 'delivered',
            lastmessageSenderId: message.senderId,
            unreadCount: 1
          };
          await db.insert(chats).values(newChat);
    }
    fetchChats()
        })

    // alert for message sender that message has been seen    
    socket.on('messagesSeen', async (payload)=> {
        //update last message status to seen
        const existing = await db
          .select()
          .from(chats)
          .where(eq(chats.id, payload.chatId))
          .limit(1);
        
        if (existing.length) {
          const chat = existing[0];
          console.log('updating chat lastMessageStatus to seen for chat', chat.id);
        
          await db
            .update(chats)
            .set({
              unreadCount: 0,
              lastMessageStatus: 'seen'
            })
            .where(eq(chats.id, payload.chatId)); 
        }
        
        // update messages status to seen
        await db
          .update(messages)
          .set({ status: payload.status, seenAt: payload.seenAt })
          .where(eq(messages.chatId, payload.chatId))

          await AsyncStorage.setItem('lastSyncedAt', new Date().toISOString());

          fetchChats();
    })
},[])

    return (
        <ChatsContext.Provider value={{ userChats, setUserChats, activeChat, setActiveChat }}>
            {children}
        </ChatsContext.Provider>
    );
}

export const useChatsContext = () => {
  const context = useContext(ChatsContext);
  if (!context) {
    throw new Error(
      "TemporaryUserContext must be used within a TempUserProvider"
    );
  }
  return context;
};
export default ChatsProvider;