import React from 'react';

import IonIcons from '@expo/vector-icons/Ionicons';

import {View, Text, StyleSheet, Pressable} from 'react-native';
import {emitter} from '../../utils/eventlistener';
import {TabContent} from '../../types/tabcontent';

type TabProps = {
  index: number;
  tab: TabContent;
  activeTabId: string;
};

const Tab: React.FC<TabProps> = ({index, tab, activeTabId}) => {
  const isActive = tab.id == activeTabId;

  const updateActiveTab = () => {
    if(activeTabId != tab.id) {
      emitter.emit("active-tab", tab);
    }
  }

  const sendDeleteTabEvent = () => {
    emitter.emit("delete-tab", tab, index);
  }

  return (
    <Pressable onPress={updateActiveTab} style={[styles.root, isActive ? styles.rootActive : null]}>
      <View style={[styles.indicator, isActive ? styles.active : styles.incative ]} />
      <Text 
        style={styles.text}
        numberOfLines={1}
        ellipsizeMode={"tail"}
      >
        {tab.name}
        </Text>
      <Pressable onPress={sendDeleteTabEvent}>
        <IonIcons name="close" size={16} color={"#f2f4f5"} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 38,
    width: 200,
    paddingHorizontal: 8,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  rootActive: {
    borderWidth: 0.5,
    borderColor: "#212121",
    backgroundColor: "#2f2f2f",
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