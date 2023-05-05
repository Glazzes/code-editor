import React, {useEffect, useState} from 'react';

import AceEditor from "react-ace";
import IonIcons from '@expo/vector-icons/Ionicons';
import Tabs from './Tabs';

import {TabContent} from './types/tabcontent';
import {emitter} from './utils/eventlistener';
import {View, StyleSheet, useWindowDimensions, Pressable} from 'react-native';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-python";

import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-xcode";

import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

type EditorProps = {};

const Editor: React.FC<EditorProps> = ({}) => {
  const {width} = useWindowDimensions();

  const [tab, setTab] = useState<TabContent | undefined>(undefined);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const onEditorTextChange = (text: string) => {
    setTab(t => {
      if(t !== undefined) {
        t.code = text.split("\n");
      }

      return t;
    });
  }

  useEffect(() => {
    const sub = emitter.addListener("active-tab", setTab);
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      <Tabs />
      <AceEditor
        mode={tab?.language ?? "java"}
        theme={"one_dark"}
        tabSize={4}
        value={tab?.code.join("\n") ?? ""}
        onChange={onEditorTextChange}
        placeholder="Let's write some awesome code!"
        focus={true}
        showPrintMargin={false}
        style={{flex: 1, width, paddingTop: 16, paddingBottom: 16}}
        setOptions={{
          enableLiveAutocompletion: true,
          enableBasicAutocompletion: true,
          showLineNumbers: true,
          fontSize: 16,
          animatedScroll: true,
          newLineMode: true,
          wrap: true,
        }}
      />
      <Pressable onPress={() => setIsRunning(true)} style={styles.run}>
        {
          isRunning ? null : <IonIcons name="play" color={"#fff"} size={24}  />
        }
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  run: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: "#2c55fb",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    top: 100,
    right: 16,
  }
});

export default Editor;