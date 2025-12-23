import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { TabButton } from './TabButton';



export default function MyTabBar({ state, navigation }: BottomTabBarProps) {
  
  const tabs = [
  { name: "chats", label: "Chats", icon: "chatbubble-ellipses", notFocused:'chatbubble-ellipses-outline' },
  { name: "calls", label: "Calls", icon: "call", notFocused:'call-outline' },
  { name: "stories", label: "Stories", icon: "paper-plane", notFocused:'paper-plane-outline' },
  { name: "profile", label: "Profile", icon: "person", notFocused:'person-outline' },
];


  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(tab.name);
        };
        return (
         <TabButton
          key={index}
          onPress={onPress}
          focused={isFocused}
          tab={tab}
         />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#ffffffff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop:10,
    // alignItems: 'center',
    width: '100%',
  },
  iconView:{
    justifyContent:'center',
    alignItems:'center',
    width:65,
    height:35,
  }
});