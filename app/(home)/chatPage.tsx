import { useChatsContext } from '@/context/chatsContext'
import { useUserContext } from '@/context/userContext'
import { db } from '@/db/client'
import { messages } from '@/db/schema'
import { httpgetOrCreateChat } from '@/requests'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { v4 as uuid } from 'uuid'
import { socket } from '../_layout'

const ChatPage = () => {
    const [chatMessages, setChatMessages] = useState<string[]>([])
    const [newMessage, setNewMessage] = useState<string | undefined>(undefined)
    // console.log('newMessage', newMessage);
    const {activeChat, setActiveChat} = useChatsContext()
    // console.log('activeChat in chat page', activeChat)
    const {user} = useUserContext()
    // console.log('user in chat page', user)
    const sendMessage = async () => {
    if (!newMessage) return;
    const date = new Date().toISOString();
    const generatedId = uuid();
    const chat = await httpgetOrCreateChat(activeChat?.participantId!, newMessage, date, user?.phoneNumber!);
    const messageToSend = {
      messageId: generatedId,
      id: generatedId,
      chatId: chat.id,
      content: newMessage,
      type: 'text',
      senderId: user?.phoneNumber!,
      receiverId: activeChat?.participantId!,
      createdAt: date,
      deliveredAt: null,
      seenAt: null,
      status:'pending'
    }

    //  save locally in SQLite
  await db.insert(messages).values(messageToSend);
  // console.log('message saved locally');

  // update UI immediately
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // send via socket.io
  socket.emit('sendMessage', messageToSend);

};

const handleChange = (text: string) => {
    setNewMessage(text);
  }

  useEffect(() => {

    return () => {
      setActiveChat(null);
    }
  }, [])
  return (
    <View style={{paddingHorizontal:15, paddingVertical:10, flex:1}}>
        <View>
            <TouchableOpacity onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
      {chatMessages.map((msg, index) => (
        <Text key={index} style={{marginVertical:5}}>{msg}</Text>
      ))}
      </View> 
      <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <TextInput value={newMessage} onChangeText={handleChange} style={{borderWidth:2, borderColor:'#1740d3ff', paddingVertical:10, width:200}}/>
        <TouchableOpacity onPress={sendMessage} style={{backgroundColor:'#1740d3ff', paddingVertical:10, paddingHorizontal:20, marginTop:10, borderRadius:5}}>
            <Text style={{color:'white', fontWeight:600}}>Send</Text>
        </TouchableOpacity>
      </View>
    
    </View>
  )
}

export default ChatPage

const styles = StyleSheet.create({})