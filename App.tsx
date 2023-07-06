import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFonts} from 'expo-font';
import SideBar from './src/features/sidebar/SideBar';
import {theme} from './src/data/theme';
import {DarkOpacityOverlay} from './src/layouts';
import NewTabModal from './src/components/NewTabModal';
import GetStarted from './src/components/GetStarted';
import {addNewTabEventListener, addOpenGenericModalListener, addOpenNewtbaModalListener, registerUpdateActiveTabNameListener} from './src/lib/emitter';
import Editor from './src/features/editor/Editor';

import TabProvider, { TabContext } from './src/context/TabProvider';
import databaseService from './src/lib/db';
import { TabContent } from './src/types/tabcontent';
import { activeTabLSId } from './src/data/constants';
import GenericModal from './src/components/GenericModal';
import { ModalData } from './src/data/modaldata';

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

  const [modalData, setModalData] = useState<ModalData & {onPress: () => void}>();
  const [showGenericModal, setShowGenericModal] = useState<boolean>(false);

  const openModal = () => setShowNewTabModal(true);
  const closeModal = () => setShowNewTabModal(false);

  const onControlKeyShortcut = (e: KeyboardEvent) => {
    if(e.ctrlKey) {
      if(e.key === "a") openModal();
  
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
  }, []);

  useEffect(() => {
    const openNewModalSub = addOpenNewtbaModalListener(openModal);
    const openGenericModal = addOpenGenericModalListener((data) => {
      setShowGenericModal(true);
      setModalData(data);
    });

    window.addEventListener("keyup", onControlKeyShortcut);
    window.addEventListener("keydown", ignoreShortcuts);

    return () => {
      openNewModalSub.remove();
      openGenericModal.remove();
      
      window.removeEventListener("keyup", onControlKeyShortcut);
      window.removeEventListener("keydown", ignoreShortcuts);
    }
  }, []);

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
      const canUse = await databaseService.initDb();
      if(canUse) {
        databaseService.getAllTabs(retrieveState);
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

      { showNewTabModal ? (
          <DarkOpacityOverlay>
            <NewTabModal onClose={closeModal} />
          </DarkOpacityOverlay>
        ) : null
      }

      {
        showGenericModal && modalData ? (
          <DarkOpacityOverlay>
            <GenericModal {...modalData} onDismiss={(() => {
							setModalData(undefined);
							setShowGenericModal(false);
						})} />
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
    backgroundColor: "#181818",
    padding: theme.spacing.s4,
    flexDirection: "row",
    justifyContent: 'center',
  },
});
