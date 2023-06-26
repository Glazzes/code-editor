import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFonts} from 'expo-font';
import SideBar from './src/components/editor/SideBar';
import {theme} from './src/data/theme';
import {DarkOpacityOverlay} from './src/layouts';
import NewTabModal from './src/components/NewTabModal';
import GetStarted from './src/components/GetStarted';
import {TabContent} from './src/types/tabcontent';
import {addNewTabEventListener, registerUpdateActiveTabNameListener} from './src/lib/emitter';
import { findTextSearchMatches } from './src/utils/findSearchMatches';
import { Editor } from './src/components/editor';
import RunningContext from './src/components/editor/RunningContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Bold": require("./assets/fonts/Inter-ExtraBold.ttf"),
    "SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Medium": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Regular": require("./assets/fonts/Inter-Regular.ttf")
  });

  const [activeTab, setActiveTab] = useState<TabContent>({name: "Java", language: "Java", id: "1", code: ""});
  const [tabs, setTabs] = useState<TabContent[]>([{name: "Java", language: "Java", id: "1", code: ""}]);
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
        setTabs([]);
        setActiveTab(undefined);
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
        const newTabs = tabs.map(t => {
          if(t.id === activeTab?.id) return activeTab;
          return t;
        });

        setActiveTab(tab);
        setTabs(newTabs);
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
    const updateTabNameSub = registerUpdateActiveTabNameListener((tabId, name) => {
      setTabs(tbs => tbs.map(t => {
        if(t.id === tabId) return {...t, name}
        return t;
      }));
    });

    return () => {
      updateTabNameSub.remove();
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keyup", onControlKeyShortcut);
    window.addEventListener("keydown", ignoreShortcuts);

    return () => {
      window.removeEventListener("keydown", ignoreShortcuts);
      window.removeEventListener("keyup", onControlKeyShortcut);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", onAltKeyShortcut);
    return () => {
      window.removeEventListener("keyup", onAltKeyShortcut);
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    const newTabSub = addNewTabEventListener(newTab => {
      setActiveTab(newTab);
      setTabs(tbs => {
        const newTabs = tbs.map(t => {
          if(t.id === activeTab?.id) return activeTab;
          return t;
        });

        return [...newTabs, newTab];
      });
    });

    return () => {
      newTabSub.remove();
    }
  }, [activeTab]);

  useEffect(() => {
    const t = findTextSearchMatches("Binary Search Java", "");

    console.log(t);
  }, [])

  if(!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <RunningContext>
        <Editor />
      </RunningContext>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
  },
});
