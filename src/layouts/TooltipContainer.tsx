import React, { useState } from 'react';
import {Text, StyleSheet} from 'react-native';

import Animated, { 
  withTiming, 
  withDelay, 
  useSharedValue, 
  useAnimatedStyle,
  runOnJS 
} from 'react-native-reanimated';
import {animationDuration} from '../data/animations';
import {theme} from '../data/theme';

type TooltipContainerProps = {
  content: string;
  children: React.ReactNode;
};

const TooltipContainer: React.FC<TooltipContainerProps> = ({children, content}) => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  const opacity = useSharedValue<number>(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });
  
  const onMouseEnter = () => {
    setShowToolTip(true);
    opacity.value = withDelay(1000, withTiming(1, {duration: animationDuration}));
  };

  const onMouseLeave = () => {
    opacity.value = withTiming(0, {duration: animationDuration}, finished => {
      if(finished) {
        runOnJS(setShowToolTip)(false);
      }
    })
  }

  return (
    <div style={{position: "relative"}} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
      {
        showToolTip ? (
          <Animated.View style={[styles.tooltip, animatedStyle]}>
            <Text style={styles.text}>{content}</Text>
          </Animated.View>
        ) : null
      }
    </div>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: "absolute",
    top: "110%",
    right: 0,
    padding: theme.spacing.s2,
    borderRadius: theme.spacing.s1,
    backgroundColor: theme.colors.sidebar.textInputBackgroundColor
  },
  text: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.sidebar.inputTextColor
  }
});

export default TooltipContainer;
