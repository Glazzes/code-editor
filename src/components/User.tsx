import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import {theme} from '../data/theme';

const bagdeSize = 11;

const User: React.FC = ({}) => {
  return (
    <View style={styles.root}>
      <View style={styles.pictureContainer}>
        <Image source={require("../../assets/images/dipper.png")} style={styles.picture} />
        <View style={styles.bagde} />
      </View>
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
  pictureContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  bagde: {
    height: bagdeSize,
    width: bagdeSize,
    borderRadius: bagdeSize / 2,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.sidebar.backgroundColor,
    backgroundColor: theme.colors.sidebar.iconColor,
    position: "absolute",
    transform: [
      {translateX: Math.cos(Math.PI / 4) * theme.sizes.touchableHeight / 2},
      {translateY: Math.sin(Math.PI / 4) * theme.sizes.touchableHeight / 2}
    ]
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
