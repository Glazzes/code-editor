import React, { useContext, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { TabContext } from '../../context/TabProvider';
import { theme } from '../../data/theme';
import { calculateTextWidth } from '../../utils/calculateTextWidth';

type ResizableInputTextProps = {
  onChangeText: (text: string) => void;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ResizableInputText: React.FC<ResizableInputTextProps> = ({onChangeText}) => {
  const {activeTab: {value: activeTab}} = useContext(TabContext);

  const width = useSharedValue<number>(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {width: width.value};
  });

  useEffect(() => {
    const textWidth = calculateTextWidth({
      text: activeTab!!.name,
      font: theme.fonts.bold,
      sizePx: 30
    });

    width.value = textWidth;
  }, []);

  useEffect(() => {
    const textWidth = calculateTextWidth({
      text: activeTab!!.name,
      font: theme.fonts.bold,
      sizePx: 30
    });

    width.value = textWidth;
  }, [activeTab]);

  return (
    <AnimatedTextInput 
      style={[styles.textInput, animatedStyle]}
      value={activeTab?.name ?? ""}
      onChangeText={onChangeText}
      autoFocus={false}
      spellCheck={false}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    color: theme.colors.editor.tabTitle,
    borderRadius: theme.spacing.s2,
  },
})

export default ResizableInputText;
