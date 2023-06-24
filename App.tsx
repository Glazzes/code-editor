import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFonts} from 'expo-font';
import SideBar from './src/components/editor/SideBar';
import Editor from './src/features/Editor';
import {theme} from './src/data/theme';
import {DarkOpacityOverlay} from './src/layouts';
import NewTabModal from './src/components/NewTabModal';
import GetStarted from './src/components/GetStarted';
import {TabContent} from './src/types/tabcontent';
import { addNewTabEventListener } from './src/lib/emitter';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Bold": require("./assets/fonts/Inter-ExtraBold.ttf"),
    "SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Medium": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Regular": require("./assets/fonts/Inter-Regular.ttf")
  });

  const [activeTab, setActiveTab] = useState<TabContent>();
  const [tabs, setTabs] = useState<TabContent[]>([]);
  const [showNewTabModal, setShowNewTabModal] = useState<boolean>(false);

  const openModal = () => setShowNewTabModal(true);
  const closeModal = () => setShowNewTabModal(false);

  const onControlKeyShortcut = (e: KeyboardEvent) => {
    if(e.ctrlKey) {
      if(e.key === "a") openModal();
  
      if(e.key === "k") {
        console.log("close active tab");
      }
  
      if(e.key === "q") {
        console.log("close all tabs");
      }

      if(e.key === "r") {
        console.log("run code");
      }

      if(e.key === "h") {
        console.log("go to history");
      }
    }
  }

  const onAltKeyShortcut = (e: KeyboardEvent) => {
    if(e.altKey && "1234567890".indexOf(e.key) != -1) {
      const index = parseInt(e.key, 10) - 1;
      const tab = tabs[index];
      if(tab) {
        setActiveTab(tab);
      }
    }
  }

  const ignoreShortcuts = (e: KeyboardEvent) => {
    if(e.ctrlKey && "akqrh".indexOf(e.key) != -1) {
      e.stopPropagation();
      e.preventDefault();
    }

    if(e.altKey && "1234567890".indexOf(e.key) != -1) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", onAltKeyShortcut);
    return () => {
      window.removeEventListener("keyup", onAltKeyShortcut);
    }
  }, [tabs]);

  useEffect(() => {
    window.addEventListener("keyup", onControlKeyShortcut);
    window.addEventListener("keydown", ignoreShortcuts);

    return () => {
      window.removeEventListener("keydown", ignoreShortcuts);
      window.removeEventListener("keyup", onControlKeyShortcut);
    }
  }, []);

  useEffect(() => {
    const newTabSub = addNewTabEventListener(newTab => {
      setTabs(t => [...t, newTab]);
      setActiveTab(newTab);
    });

    return () => {
      newTabSub.remove();
    }
  }, [])

  useEffect(() => console.log(activeTab), [activeTab]);

  if(!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SideBar tabs={tabs} />
      { activeTab ? (
          <Editor tab={activeTab} />
        ) : (
          <GetStarted />
        )
      }

      {
        showNewTabModal ? (
          <DarkOpacityOverlay>
            <NewTabModal onClose={closeModal} />
          </DarkOpacityOverlay>
        ) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.s2,
    flexDirection: "row",
    justifyContent: 'center',
  },
});
