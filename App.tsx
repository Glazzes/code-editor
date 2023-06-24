import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {useFonts} from 'expo-font';
import RunningContext from './src/components/editor/RunningContext';
import Timer from './src/components/Timer';
import SideBar from './src/components/editor/SideBar';
import Editor from './src/features/Editor';
import GetStarted from './src/components/GetStarted';
import { theme } from './src/data/theme';
import { DarkOpacityOverlay } from './src/layouts';
import NewTabModal from './src/components/NewTabModal';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Bold": require("./assets/fonts/Inter-ExtraBold.ttf"),
    "SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Medium": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Regular": require("./assets/fonts/Inter-Regular.ttf")
  });

  const [showNewTabModal, setShowNewTabModal] = useState<boolean>(false);

  const openModal = () => setShowNewTabModal(true);
  const closeModal = () => setShowNewTabModal(false);

  const onShortcut = (e: KeyboardEvent) => {
    if(e.ctrlKey) {
      if(e.key === "a") {
        openModal();
      }
  
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

    if(e.altKey && "1234567890".indexOf(e.key) != -1) {
      console.log(`Go to tab ${e.key}`);
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
    window.addEventListener("keyup", onShortcut);
    window.addEventListener("keydown", ignoreShortcuts);

    return () => {
      window.removeEventListener("keydown", ignoreShortcuts);
      window.removeEventListener("keyup", onShortcut);
    }
  }, [])

  if(!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SideBar />
      <Editor />

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
