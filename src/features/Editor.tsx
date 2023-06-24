import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-xcode";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

import {theme} from '../data/theme';
import Animated, { measure, useAnimatedReaction, useAnimatedRef, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import HStack from '../components/HStack';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Editor: React.FC = () => {
  const [name, setName] = useState<string>("LinkedListTest");

  const onChangeText = (content: string) => {
    setName(content);
  }

  const tt = () => {
    console.log("s")
    const t: HTMLInputElement = document.createElement("input");
    t.type = "file";
    t.style.position  = "absolute";
    t.style.opacity = "0";

    document.body.appendChild(t);
    t.click();
  }

  return (
    <View style={styles.root}>
      <HStack>
        <TextInput 
          style={{...styles.textInput}} 
          value={name} 
          onChangeText={onChangeText}
          autoFocus={false}
        />

        <HStack>
          <Pressable style={[styles.button, styles.importButton]}>
            <Text style={styles.importButtonText}>Importar archivo</Text>
          </Pressable>

          <Pressable onPress={tt} style={[styles.button, styles.runButton]}>
            <Text style={styles.buttonText}>Ejecutar</Text>
          </Pressable>
        </HStack>
      </HStack>
      
      <View style={styles.editorContainer}>
        <AceEditor
            mode={"java"}
            theme={"xcode"}
            tabSize={4}
            focus={true}
            showPrintMargin={false}
            style={{width: "100%", height: "100%"}}
            setOptions={{
              enableLiveAutocompletion: true,
              enableBasicAutocompletion: true,
              showLineNumbers: true,
              fontSize: 15,
              animatedScroll: true,
              newLineMode: true,
              wrap: true,
            }}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
    marginLeft: theme.spacing.s8
  },
  textInput: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.titleSize,
    borderRadius: theme.spacing.s2
  },
  editorContainer: {
    flex: 1,
    borderRadius: theme.spacing.s2,
    borderWidth: 2,
    borderColor: theme.colors.editor.border
  },
  button: {
    height: theme.sizes.touchableHeight,
    padding: theme.spacing.s4,
    borderRadius: theme.spacing.s2,
    justifyContent: "center",
    alignItems: "center",
    
  },
  runButton: {
    backgroundColor: theme.colors.generic.buttonBackgroundColor,
  },
  buttonText: {
    color: "#fff",
    fontFamily: theme.fonts.regular,
  },
  importButton: {
    borderWidth: 2,
    borderColor: theme.colors.getStarted.textColor,
  },
  importButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.getStarted.textColor,
  }
});

export default Editor;