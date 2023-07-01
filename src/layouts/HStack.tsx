import React from 'react';
import {View, StyleSheet, ViewStyle, FlexStyle} from 'react-native';

type HStackProps = {
  children: React.ReactNode;
  flex?: number;
  gap?: number;
  justifyContent?: FlexStyle["justifyContent"];
  alignItems?: FlexStyle["alignItems"];
  style?: ViewStyle;
};

const HStack: React.FC<HStackProps> = ({children, style, justifyContent, alignItems, gap, flex}) => {
  const propStyles: ViewStyle = {
    flex,
    justifyContent,
    alignItems,
    gap
  }

  return (
    <View style={[styles.hstack, propStyles, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  hstack: {
    flexDirection: "row",
  }
})

export default HStack;
