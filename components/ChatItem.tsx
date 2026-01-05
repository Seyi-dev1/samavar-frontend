import { socket } from '@/app/_layout'
import { avatars } from '@/assets/avatars/avatars'
import { useChatsContext } from '@/context/chatsContext'
import { useUserContext } from '@/context/userContext'
import { db } from '@/db/client'
import { chats } from '@/db/schema'
import { Ionicons } from '@expo/vector-icons'
import { eq } from 'drizzle-orm'
import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'



const ChatItem = ({firstName, avatarIndex, profilePhoto, partcipantId, lastMessage, chatId, lastMessageAt, lastMessageStatus, lastMessageSenderId, unreadCount}:{firstName:string, avatarIndex:number, profilePhoto:string, lastMessage:string, partcipantId:string, chatId:string, lastMessageAt:string, lastMessageStatus:string, lastMessageSenderId:string, unreadCount:number}) => {

  const {setActiveChat} = useChatsContext()
  const {user} = useUserContext()
  
    
  return (
    <TouchableOpacity 
    style={styles.chatItemContainer} 
    onPress={ async()=>{
      setActiveChat({id:chatId, participantId:partcipantId})
      if (unreadCount > 0) {
        const existing = await db
          .select()
          .from(chats)
          .where(eq(chats.participantId, partcipantId))
          .limit(1);
      
        if (existing.length) {
          const chat = existing[0];
      
          await db
          .update(chats)
          .set({
            unreadCount: 0,
          })
          .where(eq(chats.id, chat.id));
      }
      
        console.log('emitting markMessagesAsSeen', {chatId: chatId, receiverId: partcipantId});
        socket.emit('markMessagesAsSeen', {
        chatId: chatId,
        receiverId: partcipantId,
      })
      }
      
      
      router.push('/(home)/chatPage')
      
    }
  }>
      {avatarIndex &&
        <Image style={{height:45, width:45, borderRadius:23}} source={avatars[avatarIndex]}/>
      }
      {profilePhoto&&
        <Image style={{height:45, width:45, borderRadius:23}} source={{uri:profilePhoto}}/>
      }
      <View style={{gap:3}}>
        <Text style={{fontWeight:500, fontSize:16}}>{firstName}</Text>
        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
          {
            lastMessageSenderId === user?.phoneNumber&& <Ionicons name={lastMessageStatus === 'pending'? 'time-outline':lastMessageStatus === 'sent'? 'checkmark-sharp':'checkmark-done-sharp'}
          size={16}
          color={lastMessageStatus === 'seen'? '#7f72f5ff':'#6a6969ff'}
          />
          }
          
          <Text  numberOfLines={1} ellipsizeMode='tail' style={{color:'#7f7e7eff', fontWeight:600, maxWidth:250,}}>
          {lastMessage}
          </Text>
        </View>
        
      </View>
      <View style={styles.timeStamp}>
        <Text style={{color:"#676565ff", fontWeight:"600", fontSize:14}}>{new Date(lastMessageAt).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })}</Text>
      </View>
      <View style={styles.unreadCount}>
        {unreadCount > 0 &&
          <View style={{
            backgroundColor:'#7f72f5ff',
            borderRadius:10,
            height:18,
            minWidth:18,
            
            justifyContent:'center',
            alignItems:'center'
          }}>
            <Text style={{color:'white', fontWeight:'400', fontSize:12}}>{unreadCount}</Text>
          </View>
        }
      </View>
    </TouchableOpacity>
  )
}

export default ChatItem

const styles = StyleSheet.create({
    chatItemContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
        
    },
    timeStamp:{
      position:'absolute',
      top:6,
      right:15
    },
    unreadCount:{
      position:'absolute',
      bottom:0,
      right:15
    }
})