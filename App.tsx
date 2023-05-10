import React from 'react';
import { StyleSheet, View } from 'react-native';
import {Editor} from './src/components/editor';
import {useFonts} from 'expo-font';
import RunningContext from './src/components/editor/RunningContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Bold": require("./assets/fonts/Bold.ttf"),
    "Medium": require("./assets/fonts/Medium.ttf")
  });

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
