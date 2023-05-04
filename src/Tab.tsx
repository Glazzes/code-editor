import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

type TabProps = {};

const Tab: React.FC<TabProps> = ({}) => {
  return (
    <View style={styles.root}>
      <View style={[styles.indicator, styles.active]} />
      <Text style={styles.text}>Main.py</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 34,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: "#212121",
    borderWidth: 0.5,
    backgroundColor: "#2f2f2f",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  active: {
    backgroundColor: "#33c498",
  },
  incative: {
    backgroundColor: "#a9a9a9"
  },
  text: {
    color: "white",
    fontFamily: "Medium"
  }
});

export default Tab;