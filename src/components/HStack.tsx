import React from 'react';
import {View, StyleSheet} from 'react-native';
import { theme } from '../data/theme';

type HStackProps = {
    gap?: number;
    children: React.ReactNode;
};

const HStack: React.FC<HStackProps> = ({children, gap = theme.spacing.s4}) => {
  const styles = StyleSheet.create({
    root: {
      flexDirection: "row",
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
