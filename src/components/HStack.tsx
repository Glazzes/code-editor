import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import { theme } from '../data/theme';

type HStackProps = {
    gap?: number;
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | undefined;
    children: React.ReactNode;
};

const HStack: React.FC<HStackProps> = ({children, justifyContent, gap = theme.spacing.s4}) => {
  const styles = StyleSheet.create({
    root: {
      flexDirection: "row",
      justifyContent,
      alignItems: "center",
      gap,
    },
  });

  return (
    <View style={styles.root}>
      {children}
    </View>
  );
};

export default HStack;
