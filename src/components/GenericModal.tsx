import React, { useState } from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import IonIcon from '@expo/vector-icons/Ionicons';
import Logo from './Logo';
import ModalKeyFrameWrapper from './ModalKeyFrameWrapper';
import { HStack, VStack } from '../layouts';

import { theme } from '../data/theme';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { animationDuration } from '../data/animations';

type GenericModalProps = {
  title: string;
  description: string;
	actionName: string;
  rememberActionKeyName: string;
  onPress: () => void;
};

const GenericModal: React.FC<GenericModalProps> = ({
	title,
	description,
	actionName,
	rememberActionKeyName,
	onPress
}) => {
	const scale = useSharedValue<number>(0);
	const [remember, setRemember] = useState<boolean>(false);

	const onChangeDecision = () => {
		setRemember(r => !r);
	}

	const onDimmiss = () => {}

	const dimissModal = () => {
    scale.value = withTiming(0, {duration: animationDuration}, finished => {
      if(finished) {
        runOnJS(onDimmiss)();
      }
    });
  }

	const onClick = () => {
		onPress();
		if(remember) {
			localStorage.setItem(rememberActionKeyName, "true");
		}
	}

  return (
    <ModalKeyFrameWrapper onDimmiss={onDimmiss} scale={scale}>
			<View style={styles.root}>
      	<Logo dark={true} />
				<View>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{description}</Text>
					<HStack gap={theme.spacing.s2} alignItems={"center"} style={{marginTop: theme.spacing.s2}}>
						<input 
							type="checkbox"
							onChange={onChangeDecision}
							style={{width: 20, height: 20, accentColor: theme.colors.sidebar.backgroundColor}} 
						/>
						<Text style={styles.close}>No me preguntes de nuevo</Text>
					</HStack>
      	</View>

				<VStack gap={theme.spacing.s4}>
					<button type={"submit"} onClick={onClick} style={styles.button}>{actionName}</button>

					<Pressable onPress={dimissModal}>
						<HStack gap={theme.spacing.s4} alignItems={"center"}>
							<IonIcon name={"ios-arrow-back"} color={"#000"} size={theme.sizes.iconSize} />
							<Text style={styles.close}>Cerrar dialogo</Text>
						</HStack>
					</Pressable>
				</VStack>
    	</View>
		</ModalKeyFrameWrapper>
  );
};

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
		outlineStyle: "none"
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
})

export default GenericModal;