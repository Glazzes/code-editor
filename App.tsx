import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFonts} from 'expo-font';
import SideBar from './src/components/editor/SideBar';
import {theme} from './src/data/theme';
import {DarkOpacityOverlay} from './src/layouts';
import NewTabModal from './src/components/NewTabModal';
import GetStarted from './src/components/GetStarted';
import {addNewTabEventListener, registerUpdateActiveTabNameListener} from './src/lib/emitter';
import Editor from './src/features/Editor';

import TabProvider, { TabContext } from './src/context/TabProvider';
import { getAllTabs, setUpDB } from './src/lib/db';
import { TabContent } from './src/types/tabcontent';
import { activeTabLSId } from './src/data/constants';

const App = () => {
  const [fontsLoaded] = useFonts({
    "Bold": require("./assets/fonts/Inter-ExtraBold.ttf"),
    "SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Medium": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Regular": require("./assets/fonts/Inter-Regular.ttf")
  });

  const {activeTab: {value: activeTab, setActiveTab}, tabs: {value: tabs, setTabs}} 
    = useContext(TabContext);
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

  const retrieveState = (savedTabs: TabContent[]) => {
    setTabs(savedTabs);
    const lastActiveTabId = localStorage.getItem(activeTabLSId);
    if(lastActiveTabId) {
      for(let tab of savedTabs) {
        if(tab.id === lastActiveTabId) {
          setActiveTab(tab);
        }
      }
    }
  }

  useEffect(() => {
    const initDB = async () => {
      const canUse = await setUpDB();
      if(canUse) {
        await getAllTabs(retrieveState);
      }
    }

    initDB();
  }, []);

  if(!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SideBar tabs={tabs} />
      { activeTab ? (
          <Editor />
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

export default function TabApp () {
  return (
    <TabProvider>
      <App />
    </TabProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.s2,
    flexDirection: "row",
    justifyContent: 'center',
  },
});
