import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import AceEditor from "react-ace";
import { useSharedValue, withTiming } from 'react-native-reanimated';
import CodeResult from './CodeResult';
import { HStack } from '../../layouts';
import IonIcon from '@expo/vector-icons/Ionicons';
import ResizableInputText from './ResizableInputText';

import databaseService from '../../lib/db';
import { emitTriggerFakeIntervalEvent, emitUpdateTabNameEvent } from '../../lib/emitter';
import { theme } from '../../data/theme';
import { animationDuration } from '../../data/animations';
import { TabContext } from '../../context/TabProvider';
import { runCode } from '../../lib/runner';
import { readCodeFileContents } from '../../utils/fileupload';
import { activeTabLSId } from '../../data/constants';

import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-golang";

import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-cloud9_night";
import "ace-builds/src-noconflict/theme-one_dark";

import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/golang";

import "ace-builds/src-noconflict/ext-error_marker";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import EditorFooter from './EditorFooter';

const Editor: React.FC = () => {
  const {activeTab: {value: activeTab, setActiveTab}} = useContext(TabContext);

  const editorContainerRef = useRef<View>(null);

  const translateY = useSharedValue<number>(0);
  const width = useSharedValue<number>(0);
  const height = useSharedValue<number>(0);

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
    translateY.value = withTiming(-1 * (height.value / 2), {duration: animationDuration});
  }

  const onCodeChange = (content: string) => {
    setIsSaving(true);
    setActiveTab(prev => {
      if(prev) return ({...prev, code: content});
      return prev;
    });
    assignSaveTimeout(content, undefined);
  }

  const executeCodeWithKeyboardShortcut = (e: KeyboardEvent) => {
    if(e.altKey && e.key === "F9") {
      executeCode();
    }
  }

  const executeCode = () => {
    setIsRunning(true);
    setActiveTab(prev => ({...prev, lastExecution: {code: [], elapsedTime: 0}}));

    const start = performance.now();

    if(activeTab) {
      openConsole();
      emitTriggerFakeIntervalEvent();

      runCode(activeTab.language, activeTab.code)
        .then(({Output: data}) => {
          const end = performance.now();
          const diff = end - start;

          console.log(diff);
          const newActiveTab = {...activeTab, lastExecution: {code: data, elapsedTime: diff}}
          setActiveTab(newActiveTab);
          databaseService.saveTab(newActiveTab);
        })
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
      (code) => {
        setActiveTab(prev => {
          if(!prev) return prev;
          return {...prev, code};
        });

        databaseService.saveTab({...activeTab, code});
      },
      (error) => console.warn(error)
    );
  }

  useEffect(() => {
    editorContainerRef.current?.measure((x, y, w, h) => {
      width.value = w;
      height.value = h;
    });

		window.addEventListener("keyup", e => {
			if(e.ctrlKey && (e.key === "-" || e.key === "+")) {
				editorContainerRef.current?.measure((x, y, w, h) => {
          width.value = w;
          height.value = h;
        })
			}
		});
	}, []);

  useEffect(() => {
    window.addEventListener("keyup", executeCodeWithKeyboardShortcut);
    return () => {
      window.removeEventListener("keyup", executeCodeWithKeyboardShortcut);
    }
  }, [activeTab]);

  return (
    <View style={styles.root}>
      <HStack justifyContent={"space-between"}>
        <HStack gap={theme.spacing.s4}>
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

        <HStack gap={theme.spacing.s4}>
          <Pressable onPress={uploadFile} style={[styles.button, styles.importButton]}>
            <Text style={styles.importButtonText}>Importar archivo</Text>
          </Pressable>

          <Pressable onPress={executeCode} style={[styles.button, isRunning ? styles.runButtonDisabled : styles.runButton]}>
            <HStack gap={theme.spacing.s4}>
              <IonIcon name={"ios-play"} color={"#fff"} size={theme.sizes.iconSize} />
              <Text style={isRunning ? styles.runButtonTextDisabled : styles.runButtonText}>Ejecutar</Text>
            </HStack>
          </Pressable>
        </HStack>
      </HStack>
      
      <View style={styles.editorContainer} ref={editorContainerRef}>
        <AceEditor
            value={activeTab!!.code}
            onChange={onCodeChange}
            mode={activeTab!!.language.toLocaleLowerCase()}
            theme={"cloud9_night"}
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

          {activeTab != undefined ? (
            <CodeResult 
              translateY={translateY} 
              codeResult={activeTab.lastExecution.code}
              elapsedTime={activeTab.lastExecution.elapsedTime}
            />
            ) : null }
      </View>

      <EditorFooter translateY={translateY} height={height} />
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
    backgroundColor: theme.colors.editor.run,
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
    borderColor: "#fff",
  },
  importButtonText: {
    fontFamily: theme.fonts.regular,
    color: "#fff",
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
  }
});

export default React.memo(Editor);
