import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';

import AceEditor from "react-ace";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import IonIcon from '@expo/vector-icons/Ionicons';
import HStack from '../components/HStack';
import ResizableInputText from './editor/ResizableInputText';

import {emitUpdateTabNameEvent} from '../lib/emitter';
import {Language} from '../types/language';
import {theme} from '../data/theme';
import { PressableOpacity } from '../components';
import { animationDuration } from '../data/animations';
import { TabContext } from '../context/TabProvider';
import { runCode } from '../lib/runner';
import databaseService from '../lib/db';

import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-golang";

import "ace-builds/src-noconflict/theme-xcode";

import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/golang";

import "ace-builds/src-noconflict/ext-error_marker";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import { readCodeFileContents } from '../utils/fileupload';
import { activeTabLSId } from '../data/constants';

const Editor: React.FC = () => {
  const {activeTab: {value: activeTab, setActiveTab}} = useContext(TabContext);

  const selectRef = useRef<HTMLSelectElement>(null);
  const editorContainerRef = useRef<View>(null);

  const translateY = useSharedValue<number>(0);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveTimeout, setSaveTimeout] = useState<number>();

  const onTabNameTitleChange = (name: string) => {
    if(name !== "") {
      setIsSaving(false);
      setActiveTab(prev => {
        if(!prev) return prev;
        return {...prev, name}
      });
      assignSaveTimeout(undefined, name);
      emitUpdateTabNameEvent(activeTab!!.id, name);
    }
  }

  const openConsole = () => {
    editorContainerRef.current?.measure((x, y, w, h) => {
      translateY.value = withTiming((-1 * h) / 2, {duration: animationDuration});
    });
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}]
    };
  });

  const onCodeChange = (content: string) => {
    setIsSaving(true);
    setActiveTab(prev => {
      if(prev) return ({...prev, code: content});
      return prev;
    });
    assignSaveTimeout(content, undefined);
  }

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Language;
    setActiveTab(prev => {
      if(prev) return ({...prev, language: value});
      return prev;
    });
  }

  const runEditorCode = () => {
    setIsRunning(true);
    if(activeTab) {
      runCode(activeTab.language, activeTab.code)
        .then(({Output: data}) => setActiveTab({...activeTab, lastExecutionResult: data}))
        .catch(e => console.log(e))
        .finally(() => setIsRunning(false));
    }
  }

  const assignSaveTimeout = (
    code: string | undefined,
    name: string | undefined,
  ) => {
    if(saveTimeout) clearTimeout(saveTimeout);

    const newSaveInterval = setTimeout(() => {
      setIsSaving(false);
      if(activeTab) {
        const newTab = {...activeTab, code: code ?? activeTab.code, name: name ?? activeTab.name};
        databaseService.saveTab(newTab);
        localStorage.setItem(activeTabLSId, activeTab.id);
      }
    }, 1200);

    setSaveTimeout(newSaveInterval);
  }

  const uploadFile = () => {
    readCodeFileContents(
      (code) => setActiveTab(prev => {
        if(!prev) return prev;
        return {...prev, code};
      }),
      (error) => console.warn(error)
    );
  }

  useEffect(() => {
    if(selectRef.current) {
      selectRef.current.value = activeTab!!.language;
    }
  }, [activeTab]);

  return (
    <View style={styles.root}>
      <HStack justifyContent={"space-between"}>
        <HStack>
          <ResizableInputText onChangeText={onTabNameTitleChange} />
          
          <View style={[
            styles.chipContainer,
            {
              backgroundColor: isSaving ? theme.colors.generic.infoBacgroundColor : theme.colors.generic.successBackgroundColor,
              borderColor: isSaving ? theme.colors.generic.infoBacgroundColor : theme.colors.generic.successBackgroundColor
            }
          ]}>
            <IonIcon 
              name={"md-cloud-upload"} 
              size={theme.sizes.iconSize} 
              color={isSaving ? theme.colors.generic.infoTextColor : theme.colors.generic.successTextColor} 
            />
            <Text style={[
              styles.saved,
              {color: isSaving ? theme.colors.generic.infoTextColor : theme.colors.generic.successTextColor}
            ]}>{isSaving ? "Guardando" : "Guardado"}</Text>
          </View>
        </HStack>

        <HStack>
          <Pressable onPress={uploadFile} style={[styles.button, styles.importButton]}>
            <Text style={styles.importButtonText}>Importar archivo</Text>
          </Pressable>

          <Pressable onPress={runEditorCode} style={[styles.button, isRunning ? styles.runButtonDisabled : styles.runButton]}>
            <Text style={isRunning ? styles.runButtonTextDisabled : styles.runButtonText}>Ejecutar</Text>
          </Pressable>
        </HStack>
      </HStack>
      
      <View style={styles.editorContainer} ref={editorContainerRef}>
        <AceEditor
            value={activeTab!!.code}
            onChange={onCodeChange}
            mode={activeTab!!.language.toLocaleLowerCase()}
            theme={"xcode"}
            fontSize={18}
            tabSize={4}
            focus={true}
            showPrintMargin={true}
            showGutter={true}
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

          <Animated.View style={[styles.console, animatedStyle]}>
            {
              activeTab?.lastExecutionResult.map((line, index) => {
                return (
                  <Text key={`${line}-${index}`}>{line}</Text>
                )
              })
            }
          </Animated.View>
      </View>

      <View style={styles.sencodaryInfoContainer}>
        <HStack>
          <IonIcon name={"ios-information-outline"} color={theme.colors.editor.text} size={theme.sizes.iconSize} />
          <PressableOpacity onPress={openConsole}>
            <IonIcon name={"ios-terminal-outline"} color={theme.colors.editor.text} size={theme.sizes.iconSize} />
          </PressableOpacity>
          <IonIcon name={"ios-reload"} color={theme.colors.editor.text} size={theme.sizes.iconSize} />

          <select 
            ref={selectRef} 
            defaultValue={activeTab!!.language} 
            onChange={onLanguageChange}
            style={styles.select}
          >
            <option value="Bash">Bash</option>
            <option value="Golang">Go</option>
            <option value="Java">Java</option>
            <option value="Javascript">JavaScript</option>
            <option value="Python">Python</option>
          </select>
        </HStack>
      </View>
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
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.generic.successBackgroundColor,
    borderWidth: 1,
    borderColor: theme.colors.generic.successTextColor,
    borderRadius: theme.spacing.s1,
    padding: theme.spacing.s1,
    gap: theme.spacing.s2
  },
  saved: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.generic.successTextColor
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
  runButtonDisabled: {
    backgroundColor: "#fafafc",
  },
  runButtonText: {
    color: "#fff",
    fontFamily: theme.fonts.regular,
  },
  runButtonTextDisabled: {
    color: "#a4abb6",
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
  console: {
      width: "100%",
      height: "50%",
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowRadius: 40,
      shadowOpacity: 0.15,
      shadowOffset: {height: -5, width: 0},
      backgroundColor: "#fff",
      borderRadius: theme.spacing.s4,
      position: "absolute",
      top: "100%",
      zIndex: 999
  },
  sencodaryInfoContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
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

export default React.memo(Editor);
