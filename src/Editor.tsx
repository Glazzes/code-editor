import React, { useState } from 'react';

import AceEditor from "react-ace";

import {View, StyleSheet, useWindowDimensions} from 'react-native';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-python";

import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-xcode";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import Tabs from './Tabs';
import Tab from './Tab';

type EditorProps = {};

const Editor: React.FC<EditorProps> = ({}) => {
  const {width} = useWindowDimensions();

  const [code, setCode] = useState<string[]>([]);
  const onEditorTextChange = (content: string) => {
    setCode(content.split("\n"));
  }

  return (
    <View style={styles.root}>
        <Tabs>
            <Tab />
            <Tab />
        </Tabs>
      <AceEditor
        mode={"java"}
        theme={"one_dark"}
        tabSize={4}
        onChange={onEditorTextChange}
        placeholder="Start coding!!!!"
        focus={true}
        showPrintMargin={false}
        style={{flex: 1, width}}
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
});

export default Editor;