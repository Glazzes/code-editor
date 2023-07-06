import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HStack } from '../../layouts';
import IonIcon from '@expo/vector-icons/Ionicons';
import { PressableOpacity } from '../../components';
import { theme } from '../../data/theme';
import { TabContext } from '../../context/TabProvider';
import { Language } from '../../types/language';
import databaseService from '../../lib/db';
import { clearTabCodeKey } from '../../data/constants';
import { clearTabCodeData } from '../../data/modaldata';
import { emitOpenGenericModalEvent } from '../../lib/emitter';
import KeyBoardShortcuts from './KeyBoardShortcuts';
import Animated, { withTiming } from 'react-native-reanimated';
import { animationDuration } from '../../data/animations';

type EditorFooterProps = {
  translateY: Animated.SharedValue<number>;
  height: Animated.SharedValue<number>;
}

const EditorFooter: React.FC<EditorFooterProps> = ({translateY, height}) => {
	const selectionRef = useRef<HTMLSelectElement>(null);

	const {activeTab: {value: activeTab, setActiveTab}} = useContext(TabContext);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

	const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Language;
    if(activeTab) {
      const newActiveTab = {...activeTab, language: value};
      setActiveTab(newActiveTab);
      databaseService.saveTab(newActiveTab);
    }
  }

  const openConsole = () => {
    if(translateY.value !== 0) {
      translateY.value = withTiming(0, {duration: animationDuration});
    }else{
      translateY.value = withTiming(-1 * (height.value / 2), {duration: animationDuration});
    }
  }

  const toggleShortcuts = () => {
    setShowShortcuts(prev => !prev);
  }

  const clearCodeWithDecison = () => {
    const lastDecision = localStorage.getItem(clearTabCodeKey);
    if(lastDecision !== null) {
      clearCode();
    }else {
      emitOpenGenericModalEvent({...clearTabCodeData, onPress: clearCode});
    }
  }

  const clearCode = () => {
    if(activeTab !== undefined) {
      const newTab = {...activeTab, code: ""};
      setActiveTab(newTab);
      databaseService.saveTab(activeTab);
    }
  }

  useEffect(() => {
    if(selectionRef.current) {
      selectionRef.current.value = activeTab!!.language;
    }
    
  }, [activeTab]);

  return (
    <View style={styles.root}>
      <HStack alignItems='center' gap={theme.spacing.s4}>

        <View>
          { showShortcuts ? (
            <KeyBoardShortcuts onDissmis={toggleShortcuts} />
          ): null }
          <PressableOpacity onPress={toggleShortcuts}>
            <IonIcon name={"ios-information-circle-outline"} color={theme.colors.editor.footerIconColor} size={theme.sizes.iconSize * 1.2} />
          </PressableOpacity>
        </View>

        <PressableOpacity onPress={openConsole}>
          <IonIcon name={"ios-terminal-outline"} color={theme.colors.editor.footerIconColor} size={theme.sizes.iconSize} />
        </PressableOpacity>

        <PressableOpacity onPress={clearCodeWithDecison}>
          <IonIcon name={"ios-reload"} color={theme.colors.editor.footerIconColor} size={theme.sizes.iconSize} />
        </PressableOpacity>

        <select 
          ref={selectionRef} 
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
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "row",
		justifyContent: "flex-end",
    alignItems: "center"
  },
	select: {
    height: theme.sizes.touchableHeight,
    minWidth: 150,
    borderWidth: 0,
    borderColor: theme.colors.editor.border,
    borderRadius: theme.spacing.s2,
    fontFamily: theme.fonts.medium,
    paddingLeft: theme.spacing.s4,
    paddingRight: theme.spacing.s4,
		outline: "none",
		outlineStyle: "none"
  }
});

export default EditorFooter;
