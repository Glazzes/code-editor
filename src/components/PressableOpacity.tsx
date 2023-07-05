import React from 'react';
import {Pressable, ViewStyle} from 'react-native';

type PressableOpacityProps = {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
};

const PressableOpacity: React.FC<PressableOpacityProps> = ({children, onPress, style}) => {
  return (
    <Pressable onPress={onPress} style={({pressed}) => {
        return {...style, opacity: pressed ? 0.7 : 1}
    }} >
      {children}
    </Pressable>
  );
};

export default PressableOpacity;