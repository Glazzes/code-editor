import React, {useEffect, useState} from 'react';

import Tab from './Tab';
import IonIcons from '@expo/vector-icons/Ionicons';

import {View, StyleSheet, Pressable, Text, ScrollView} from 'react-native';
import {emitter} from './utils/eventlistener';
import {v4 as uuid} from 'uuid';
import {TabContent} from './types/tabcontent';

type TabsProps = {
  tabs: TabContent[];
  activeTab: TabContent;
};

const Tabs: React.FC<TabsProps> = ({tabs, activeTab}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const createNewTab = () => {
    const newTab: TabContent = {
      id: uuid(),
      name: uuid(),
      code: [],
      language: "Java"
    }

    emitter.emit("create-tab", newTab);
  }

  const runCode = async () => {
    setIsRunning(true);
    if(!isRunning) {
      try{
        fetch("http://localhost:5000/api/run", {
          method: "POST", 
          body: JSON.stringify({language: activeTab.language, code: activeTab.code})
        })
        .then(res => res.json())
        .then((data) => {
          emitter.emit("display-result", data);
        })
      }catch(e) {
        console.error(e);
      } finally {
        setIsRunning(false);
      }
    }
  }

  useEffect(() => {
    const saveTabs = setTimeout(() => {
      const tabsString = JSON.stringify(tabs);
      const activeTabString = JSON.stringify(activeTab);

      localStorage.setItem("tabs", tabsString);
      localStorage.setItem("last-active-tab", activeTabString);
    }, 1000);

    return () => {
      clearTimeout(saveTabs);
    }
  }, [tabs, activeTab]);

  return (
    <View style={styles.statusbar}>
      <View style={styles.tabContainer}>
      {
          tabs.map((tab, index) => {
            return <Tab 
              key={`tab-${index}`} 
              index={index}
              tab={tab}
              activeTabId={activeTab.id} 
             />
          })
        }
        <Pressable onPress={createNewTab} style={[styles.newTab]}>
          <IonIcons name='add' color={"#a9a9a9"} size={24} />
        </Pressable>
      </View>
      
      
      <Pressable 
        onPress={() => {
          setIsRunning(true);
          runCode();
        }}
        style={[styles.run, isRunning ? styles.runDisabled : styles.runEnabled]}
        >
        <IonIcons name={"play"} size={20} color={isRunning ? "#c4c4ca" : "#fff"} />
        <Text style={isRunning ? styles.runTextDisabled : styles.runText}>Run</Text>
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
    // justifyContent: "space-between",
    gap: 8
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    overflow: "scroll"
  },
  newTab: {
    height: 38,
    width: 38,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#212121",
    backgroundColor: "#2f2f2f",
    justifyContent: "center",
    alignItems: "center",
  },
  run: {
    height: 38,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16
  },
  runEnabled: {
    backgroundColor: "#2c55fb",
  },
  runDisabled: {
    backgroundColor: "#f3f3f4"
  },
  runText: {
    color: "#fff",
    fontFamily: "Bold"
  },
  runTextDisabled: {
    color: "#c4c4ca",
    fontFamily: "Bold"
  }
});

export default Tabs;