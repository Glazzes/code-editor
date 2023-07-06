import React, { useState } from 'react';

import IonIcon from '@expo/vector-icons/Ionicons';

import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../data/theme';
import { HStack } from '../../layouts';
import { PressableOpacity } from '../../components';

type KeyBoardShortcutsProps = {
	onDissmis: () => void;
}

type Shortcut = {
  action: string,
	combination: string;
}

const shortcuts: Shortcut[] = [
	{action: "Nueva pestaña", combination: "Ctrl + A"},
	{action: "Autocompletado", combination: "Ctrl + Espacio"},
	{action: "Alternar pestaña", combination: "Alt + Numero"},
	{action: "Cerrar pestaña", combination: "Alt + K"},
	{action: "Cerrar todas", combination: "Alt + Q"},
	{action: "Ejecutar codigo", combination: "Alt + F9"}
]

const KeyBoardShortcuts: React.FC<KeyBoardShortcutsProps> = ({onDissmis}) => {
	const [height, setHeight] = useState<number>(0);
	const innerStyle: ViewStyle = {
		top: -1 * height
	};

  return (
    <View style={[styles.root, innerStyle]} onLayout={e => setHeight(e.nativeEvent.layout.height)}>
      <HStack alignItems={"center"} justifyContent={"space-between"} style={styles.titleContainer}>
        <Text style={styles.title}>Atajos</Text>
        <PressableOpacity onPress={onDissmis}>
					<IonIcon name={"ios-arrow-back"} color={"#000"} size={theme.sizes.iconSize} />
				</PressableOpacity>
      </HStack>

			{ shortcuts.map((short, index) => {
				return (
					<HStack alignItems={"center"} justifyContent={"space-between"} style={styles.shortcut}>
						<Text style={styles.action}>{short.action}</Text>
						<Text style={styles.combination}>{short.combination}</Text>
					</HStack>
				)
			}) }
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: 300,
    padding: theme.spacing.s4,
    borderRadius: theme.spacing.s2,
    backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "lightgrey",
		borderStyle: "solid",
		position: "absolute",
		left: -300,
  },
	titleContainer: {
		marginBottom: theme.spacing.s4
	},
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 20
  },
	shortcut: {
		paddingVertical: theme.spacing.s2,
	},
	action: {
		fontFamily: theme.fonts.regular
	},
	combination: {
		color: "#000",
		backgroundColor: "#f4f4f4",
		padding: theme.spacing.s2,
		borderRadius: theme.spacing.s2
	}
});

export default KeyBoardShortcuts;
