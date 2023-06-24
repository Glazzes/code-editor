import React, { useState } from 'react';
import {Text, StyleSheet} from 'react-native';
import { theme } from '../data/theme';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type TooltipContainerProps = {
  content: string;
  children: React.ReactNode;
};

const TooltipContainer: React.FC<TooltipContainerProps> = ({children, content}) => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  const onMouseEnter = () => setShowToolTip(true);
  const onMouseLeave = () => setShowToolTip(false);

  return (
    <div style={{position: "relative"}} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
      {
        showToolTip ? (
          <Animated.View 
            entering={FadeIn.duration(500)} 
            exiting={FadeOut.duration(500)}
            style={styles.tooltip}>
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
