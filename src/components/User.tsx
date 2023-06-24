import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import {theme} from '../data/theme';

type UserProps = {};

const User: React.FC<UserProps> = ({}) => {
  return (
    <View style={styles.root}>
      <Image source={require("../../assets/images/dipper.png")} style={styles.picture} />
      <View>
        <Text style={[styles.text, styles.username]}>Santiago Zapata</Text>
        <Text style={styles.text}>Software developer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: theme.spacing.s4,
    backgroundColor: theme.colors.sidebar.textInputBackgroundColor,
    borderRadius: theme.spacing.s2,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4
  },
  picture: {
    width: theme.sizes.touchableHeight,
    height: theme.sizes.touchableHeight,
    borderRadius: theme.sizes.touchableHeight / 2
  },
  username: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.sidebar.textColor
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sidebar.inputTextColor,
    fontSize: 13
  }
});

export default User;
