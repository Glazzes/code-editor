import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {theme} from '../data/theme';

import IonIcon from '@expo/vector-icons/Ionicons';
import Logo from './Logo';
import HStack from './HStack';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { animationDuration, modalBezierIn } from '../data/animations';

type NewTabModalProps = {
  onClose: () => void;
}

const NewTabModal: React.FC<NewTabModalProps> = ({onClose}) => {
  const [tabName, setTabName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTabName(e.target.value);
  }

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  }

  const onSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(tabName, language);
  }

  // Animations
  const scale = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}]
    };
  });

  const entering = () => {
    scale.value = withTiming(1, {
      duration: animationDuration, easing: modalBezierIn
    });
  }

  const exiting = () => {
    scale.value = withTiming(0, {duration: animationDuration}, (finished) => {
      if(finished) {
        runOnJS(onClose)();
      }
    })
  }

  useEffect(() => {
    entering();
  }, [])

  return (
    <Animated.View style={[styles.root, rStyle]}>
      <Logo dark={true} />
      <View>
        <Text style={styles.title}>Crear nueva pestaña</Text>
        <Text style={styles.subtitle}>
            Escoge un nombre y un lenguaje de programacion para que empecemos
        </Text>
      </View>

      <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column", gap: theme.spacing.s4}}>
        <View style={styles.inputContainer}>
            <IonIcon 
            name={"ios-pencil"} 
            color={theme.colors.modal.inputTextColor}
            size={theme.sizes.iconSize}  
            />
            <input
              onChange={onTextChange}
              type={"text"} 
              placeholder={"LinkedList.java"} 
              style={styles.textInput}
              required={true}
            />
        </View>

        <select
            onChange={onSelectChange}
            name="Selecciona un lenguage de programacion" 
            style={styles.select} required={true}
        >
            <option value="">-- Selecciona un lenguage --</option>
            <option value="bash" style={styles.option}>Bash</option>
            <option value="go" style={styles.option}>Go</option>
            <option value="java" style={styles.option}>Java</option>
            <option value="javascript" style={styles.option}>JavaScript</option>
            <option value="python" style={styles.option}>Python</option>
        </select>

        <button type={"submit"} style={styles.button}>Crear pestaña</button>

        <Pressable onPress={exiting}>
          <HStack>
            <IonIcon name={"ios-arrow-back"} color={"#000"} size={theme.sizes.iconSize} />
            <Text style={styles.close}>Cerrar dialogo</Text>
          </HStack>
        </Pressable>
      </form>
    </Animated.View>
  );
};

const formStyles = {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.s4
}

const styles = StyleSheet.create({
  root: {
    width: 370,
    padding: theme.spacing.s4,
    backgroundColor: theme.colors.modal.backgroundColor,
    borderRadius: theme.spacing.s4,
    gap: theme.spacing.s8,
  },
  title: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.modal.titleColor,
    fontSize: 25
  },
  subtitle: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.modal.subtitleColor
  },
  inputContainer: {
    backgroundColor: theme.colors.modal.inputTextBackgroundColor,
    borderRadius: theme.spacing.s2,
    borderColor: theme.colors.modal.inputTextBorderColor,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.s4,
    gap: theme.spacing.s4
  },
  textInput: {
    width: "100%",
    height: theme.sizes.touchableHeight,
    color: theme.colors.modal.inputTextColor,
    fontFamily: theme.fonts.medium,
    
    outlineStyle: "none",
    borderWidth: 0
  },
  select: {
    fontFamily: theme.fonts.medium,
    width: "100%",
    height: theme.sizes.touchableHeight,
    backgroundColor: theme.colors.modal.inputTextBackgroundColor,
    borderRadius: theme.spacing.s2,
    borderWidth: 2,
    borderColor: theme.colors.modal.inputTextBorderColor,
  },
  option: {
    height: theme.sizes.touchableHeight,
    backgroundColor: theme.colors.modal.inputTextBackgroundColor,
  },
  button: {
    width: "100%",
    height: theme.sizes.touchableHeight,
    backgroundColor: theme.colors.generic.buttonBackgroundColor,
    borderRadius: theme.spacing.s2,
    color: "#ffffff",
    fontFamily: theme.fonts.medium,
    borderWidth: 0,
    cursor: "pointer"
  },
  close: {
    fontFamily: theme.fonts.medium,
    color: "#000"
  }
});



export default NewTabModal;
