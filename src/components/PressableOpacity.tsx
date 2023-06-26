import React from 'react';
import {Pressable} from 'react-native';

type PressableOpacityProps = {
    children: React.ReactNode;
    onPress: () => void;
};

const PressableOpacity: React.FC<PressableOpacityProps> = ({children, onPress}) => {
  return (
    <Pressable onPress={onPress} style={({pressed}) => {
        return {opacity: pressed ? 0.7 : 1}
    }} >
      {children}
    </Pressable>
  );
};

export default PressableOpacity;