import React, {ReactNode} from 'react';

import {View, StyleSheet, Pressable} from 'react-native';
import IonIcons from '@expo/vector-icons/Ionicons';

type TabsProps = {
  children?: ReactNode;
};

const Tabs: React.FC<TabsProps> = ({children}) => {
  return (
    <View style={styles.statusbar}>
      {children}
      <Pressable style={styles.newTab}>
        <IonIcons name='add' color={"#a9a9a9"} size={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  statusbar: {
    width: "100%",
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: "#141414",
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  newTab: {
    height: 34,
    width: 34,
    borderRadius: 5,
    borderColor: "#212121",
    borderWidth: 1,
    backgroundColor: "#2f2f2f",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Tabs;