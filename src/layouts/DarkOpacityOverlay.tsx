import React from 'react';
import {View, StyleSheet} from 'react-native';

type DarkOpacityOverlayProps = {
    children: React.ReactNode;
}

const DarkOpacityOverlay: React.FC<DarkOpacityOverlayProps> = ({children}) => {
  return (
    <View style={styles.root}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DarkOpacityOverlay;
