import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {theme} from '../data/theme';

type LogoProps = {
    dark: boolean;
}

const Logo: React.FC<LogoProps> = ({dark}) => {
  return (
    <View style={styles.root}>
      <View style={[styles.logo, {borderColor: dark ? "#000000" : "#ffffff"}]} />
      <Text style={[styles.title,  {color: dark ? "#000000" : "#ffffff"}]}>Borealis</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: "center",
    gap: theme.spacing.s4,
  },
  logo: {
    width: theme.sizes.touchableHeight / 2,
    height: theme.sizes.touchableHeight / 2,
    borderRadius: theme.sizes.touchableHeight / 4,
    borderWidth: 3,
    borderColor: "#ffffff"
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: theme.fonts.bold
  }
});

export default Logo;
