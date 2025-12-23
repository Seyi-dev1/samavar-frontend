import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const Chats = () => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={() => {
        Animated.spring(scale, {
          toValue: 1.2,
          useNativeDriver: true,
        }).start(() =>
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }).start()
        );
      }}
    >
      <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "red",
          transform: [{ scale }],
        }}
      />
    </Pressable>
  );
}

export default Chats

const styles = StyleSheet.create({})