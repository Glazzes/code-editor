import React, {useEffect, useState} from 'react';

import {View, StyleSheet, Pressable} from 'react-native';
import IonIcons from '@expo/vector-icons/Ionicons';
import Tab from './Tab';
import {emitter} from './utils/eventlistener';
import {v4 as uuid} from 'uuid';
import {TabContent} from './types/tabcontent';

type TabsProps = {};

const startingTab: TabContent = {id: uuid(), name: "New tab", code: [], language: "java"};

const Tabs: React.FC<TabsProps> = () => {
  const [tabs, setTabs] = useState<TabContent[]>([startingTab]);
  const [activeTab, setActiveTab] = useState<TabContent>(startingTab);

  const createNewTab = () => {
    const newTab: TabContent = {
      id: uuid(),
      name: uuid(),
      code: [],
      language: "java"
    }

    setActiveTab(newTab);
    setTabs(t => [...t, newTab]);
    emitter.emit("active-tab", newTab);
  }

  useEffect(() => {
    emitter.emit("active-tab", startingTab);
  }, [])

  useEffect(() => {
    const subscription = emitter.addListener("delete-tab", 
    (tab: TabContent, index: number) => {
      const isLastTab = index === tabs.length - 1;
      const isActiveTab = activeTab.id == tab.id
      let newActiveTab;
       
      if(isLastTab && isActiveTab) {
        newActiveTab = tabs[index - 1];
        emitter.emit("active-tab", tabs[index - 1]);
      }

      if(!isLastTab && isActiveTab) {
        newActiveTab = tabs[index + 1];
        emitter.emit("active-tab", tabs[index + 1]);
      }

      if(newActiveTab) {
        setActiveTab(newActiveTab);
      }

      setTabs((t) => t.filter((item) => item.id != tab.id));

      return () => subscription.remove();
    }, [tabs, activeTab]);

    return () => {
      subscription.remove();
    }
  }, [tabs, activeTab])

  return (
    <View style={styles.statusbar}>
      {
        tabs.map((tab, index) => {
          return <Tab 
            key={`tab-${index}`} 
            index={index}
            tab={tab}
            activeTabId={activeTab.id} 
            setActiveTab={setActiveTab}
          />
        })
      }
      <Pressable onPress={createNewTab} style={[styles.newTab]}>
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
    borderWidth: 1,
    borderColor: "#212121",
    backgroundColor: "#2f2f2f",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Tabs;