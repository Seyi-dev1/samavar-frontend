import ChatItem from '@/components/ChatItem';
import { User, useUserContext } from '@/context/userContext';
import { httpFetchOnlineUsers } from '@/requests';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { v4 as uuid } from 'uuid';

const Profile = () => {
  const {user}= useUserContext();
  const [onlineUsers, setOnlineUsers] = React.useState<User[]|null>(null)
  console.log(onlineUsers)

  useEffect(()=> {
    const fetchOnlineUsers = async () => {
      try {
        const response = await  httpFetchOnlineUsers()
        console.log(response.data)
        setOnlineUsers(response.data);
      } catch (error) {
        console.log("Failed to fetch online users:", error);
      }
    }

    fetchOnlineUsers();
  },[])
  return (
    <View style={{flex:1, padding:15, gap:15}}>
      {onlineUsers?.filter(onlineUser=> onlineUser.phoneNumber !== user?.phoneNumber).map(user => (
        <ChatItem 
        firstName={user.firstName!} 
        avatarIndex={user.avatarIndex!}
        profilePhoto={user.profilePhoto!}
        partcipantId={user.phoneNumber!}
        lastMessage={""}
        lastMessageAt=''
        chatId={uuid()}
        lastMessageStatus={'pending'}
        unreadCount={0}
        key={user.phoneNumber}/>
      ))}
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})