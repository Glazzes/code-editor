import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';

import AceEditor from "react-ace";
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import IonIcon from '@expo/vector-icons/Ionicons';
import HStack from '../components/HStack';

import {calculateTextWidth} from '../utils/calculateTextWidth';
import {theme} from '../data/theme';
import {TabContent} from '../types/tabcontent';

import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-error_marker";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

type EditorProps = {
  tab: TabContent;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Editor: React.FC<EditorProps> = ({tab}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const [name, setName] = useState<string>(tab.name);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [saveTimeout, setSaveTimeout] = useState<number>();

  const onCodeChange = (content: string) => {
    setIsSaved(false);
    const code = content.split("\n");

    assignSaveTimeout();
  }

  const onTabNameTitleChange = (content: string) => {
    if(content !== "") {
      setIsSaved(false);
      setName(content);
      assignSaveTimeout();

      const textWidth = calculateTextWidth({
        text: content,
        font: theme.fonts.bold,
        sizePx: 30,
      });

      inputWidth.value = textWidth;
    }
  }

  const assignSaveTimeout = () => {
    if(saveTimeout) clearTimeout(saveTimeout);

    const newSaveInterval = setTimeout(() => {
      setIsSaved(true);
    }, 2000);

    setSaveTimeout(newSaveInterval);
  }

  const uploadFile = () => {
    const t: HTMLInputElement = document.createElement("input");
    t.type = "file";
    t.style.position  = "absolute";
    t.style.opacity = "0";

    document.body.appendChild(t);
    t.click();
  }

  // Aniamtions
  const inputWidth = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      width: inputWidth.value,
    };
  });

  useEffect(() => {
    const textWidth = calculateTextWidth({
      text: name,
      font: theme.fonts.bold,
      sizePx: 30
    });

    inputWidth.value = textWidth;
  }, []);

  useEffect(() => {
    setName(tab.name);

    if(selectRef.current) {
      selectRef.current.value = tab.language;
    }

    const textWidth = calculateTextWidth({
      text: tab.name,
      font: theme.fonts.bold,
      sizePx: 30
    });

    inputWidth.value = textWidth;
  }, [tab])

  return (
    <View style={styles.root}>
      <HStack justifyContent={"space-between"}>
        <HStack>
          <AnimatedTextInput 
            style={[styles.textInput, rStyle]} 
            value={name} 
            onChangeText={onTabNameTitleChange}
            autoFocus={false}
            spellCheck={false}
          />
          {
            isSaved ? (
              <View style={styles.chipContainer}>
                <IonIcon name={"md-cloud-upload"} size={theme.sizes.iconSize} color={"#3e6c58"} />
                <Text style={styles.saved}>Guardado</Text>
              </View>
            ) : null
          }
        </HStack>

        <HStack>
          <Pressable onPress={uploadFile} style={[styles.button, styles.importButton]}>
            <Text style={styles.importButtonText}>Importar archivo</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.runButton]}>
            <Text style={styles.buttonText}>Ejecutar</Text>
          </Pressable>
        </HStack>
      </HStack>
      
      <View style={styles.editorContainer}>
        <AceEditor
            onChange={onCodeChange}
            mode={tab.language.toLocaleLowerCase()}
            theme={"xcode"}
            fontSize={16}
            tabSize={4}
            focus={true}
            showPrintMargin={true}
            style={{width: "100%", height: "100%"}}
            setOptions={{
              enableLiveAutocompletion: true,
              enableBasicAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              animatedScroll: true,
              newLineMode: true,
              wrap: true,
            }}
          />
      </View>

      <HStack>
        <IonIcon name={"ios-information-outline"} color={theme.colors.editor.text} size={theme.sizes.iconSize} />
        <IonIcon name={"ios-terminal-outline"} color={theme.colors.editor.text} size={theme.sizes.iconSize} />
        <IonIcon name={"ios-reload"} color={theme.colors.editor.text} size={theme.sizes.iconSize} />

        <select ref={selectRef} defaultValue={tab.language} style={styles.select}>
          <option value="Bash">Bash</option>
          <option value="Golang">Go</option>
          <option value="Java">Java</option>
          <option value="Javascript">JavaScript</option>
          <option value="Python">Python</option>
        </select>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
    gap: theme.spacing.s4,
    marginLeft: theme.spacing.s8
  },
  textInput: {
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    borderRadius: theme.spacing.s2
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2ee",
    borderWidth: 1,
    borderColor: "#3e6c58",
    borderRadius: theme.spacing.s1,
    padding: theme.spacing.s1,
    gap: theme.spacing.s2
  },
  saved: {
    fontFamily: theme.fonts.regular,
    color: "#3e6c58"
  },
  editorContainer: {
    flex: 1,
    borderRadius: theme.spacing.s2,
    borderWidth: 2,
    borderColor: theme.colors.editor.border,
    overflow: "hidden"
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
    borderWidth: 1,
    borderColor: theme.colors.getStarted.textColor,
  },
  importButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.getStarted.textColor,
  },
  select: {
    height: theme.sizes.touchableHeight,
    minWidth: 150,
    borderWidth: 1,
    borderColor: theme.colors.editor.border,
    borderRadius: theme.spacing.s2,
    fontFamily: theme.fonts.medium
  }
});

export default Editor;