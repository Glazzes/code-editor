import React, { useEffect } from 'react';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { animationDuration, modalBezierIn } from '../data/animations';

type ModalKeyFrameWrapperProps = {
  scale: Animated.SharedValue<number>;
  onDimmiss: () => void;
  children: React.ReactNode;
};

const ModalKeyFrameWrapper: React.FC<ModalKeyFrameWrapperProps> = ({children, scale}) => {
  const animatedStyle = useAnimatedStyle(() => ({transform: [{scale: scale.value}]}));

  useEffect(() => {
    scale.value = withTiming(1, {duration: animationDuration, easing: modalBezierIn});
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

export default ModalKeyFrameWrapper;
