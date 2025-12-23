import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

export function TabButton({ focused, onPress, tab, }:{focused:boolean, onPress:()=>void, tab:{icon:any, label:string, name:string, notFocused:any}    }) {
  const pillStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 1 : 0, { duration: 100 }),
      transform: [
        {
          scale: withSpring(focused ? 1 : 0.5, {
            
          }),
        },
      ],
    };
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.0 : 1.08, {
            damping: 18,
            stiffness: 180,
          }),
        },
      ],
    };
  }, [focused]);

  return (
    <Pressable onPress={onPress} style={styles.tab}>
      {/* Background pill */}
      

      {/* Icon */}
      <Animated.View style={[iconStyle, { justifyContent: 'center', alignItems: 'center', width: 65, height: 35 }]}>
        <Ionicons
          name={focused?tab.icon:tab.notFocused}
          size={22}
          color={focused ? "#7f72f5ff" : "#7e7d7dff"}
        />
        <Animated.View style={[styles.pill, pillStyle]} />
      </Animated.View>

      <Text
        style={[
          styles.label,
          { color: focused ? "#2a2929ff" : "#444444ff", fontWeight: focused ? "600" : "500" },
        ]}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  pill: {
    position: "absolute",
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: "#e5eafdff",
    top: 0,
    zIndex: -1,
  },
  label: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
});
