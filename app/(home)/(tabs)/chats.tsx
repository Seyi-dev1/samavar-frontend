import { avatars } from '@/assets/avatars/avatars';
import ChatItem from '@/components/ChatItem';
import { useChatsContext } from '@/context/chatsContext';
import { useUserContext } from '@/context/userContext';
import { httpGetChatsForUI, httpsyncMissingUsers } from '@/requests';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const Chats = () => {

  const {user} = useUserContext()
  // console.log(user)

  const {userChats, activeChat} = useChatsContext();

  const [UIChats, setUIChats] = React.useState<any>([]);
  // console.log('UIChats', UIChats)

  // console.log(`chats in chats tab${user?.firstName}`, userChats)
 
  useEffect(()=> {
    const fetchUIChats = async () => {
      const result = await httpGetChatsForUI()
      // console.log('chats for UI', result)
      //  Render instantly from local DB
      setUIChats(result);

      //  Sync missing user info in background
      await httpsyncMissingUsers();

      // Re-render with names/photos
    const updated = await httpGetChatsForUI();
    setUIChats(updated);
    }
    fetchUIChats();
  }, [activeChat, userChats])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <View>
          <View>
            {user?.profilePhoto && <Image source={{uri: user.profilePhoto}} style={{width:35, height:35, borderRadius:17.5}}/>}
            {user?.avatarIndex && <Image source={ avatars[user.avatarIndex]} style={{width:35, height:35, borderRadius:17.5}}/>}
          </View>
        </View>
        <Text style={{fontWeight:600, color:"#7f72f5ff", fontSize:23}}>Samavar</Text>
        <View>
          <TouchableOpacity>
            <Ionicons name='settings-outline' size={22} color={"#3c3c3cff"}/>
          </TouchableOpacity>
          
        </View>
      </View>
      <TouchableOpacity>
        <View style={styles.searchbar}>
        <Feather name='search' size={22} color={'#636262ff'}/>
        <Text style={{color:'#737272ff', fontSize:15.6, fontWeight:500}}>Ask Gemini or Search</Text>
      </View>
      </TouchableOpacity>

      <View style={{gap:10, marginTop:30}}>
        {UIChats.map((chat:any) => {
          return <ChatItem 
          partcipantId={chat.participantId}
          firstName={chat.firstName}
          avatarIndex={chat.avatarIndex}
          profilePhoto={chat.profilePhoto}
          lastMessage={chat.lastMessage}
          lastMessageAt={chat.lastMessageAt}
          lastMessageStatus={chat.lastMessageStatus}
          unreadCount={chat.unreadCount}
          chatId={chat.chatId}
          lastMessageSenderId={chat.lastMessageSenderId}
          key={chat.chatId}
          />
        } )}
      </View>
      
    </View>
  );
}

export default Chats

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  header:{
    flexDirection:"row",
    justifyContent:'space-between',
    alignItems:'center'
  },
  searchbar:{
    flexDirection:'row',
    gap:15,
    alignItems:'center',
    backgroundColor:'#f4f4f4ff',
    paddingHorizontal:15,
    paddingVertical:12,
    marginTop:15,
    borderRadius:25
  }
})