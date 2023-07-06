import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import IonIcon from '@expo/vector-icons/Ionicons';

import { theme } from '../../data/theme';
import { addTriggerFakeIntervalListener } from '../../lib/emitter';
import { convertFakeTimeToText } from '../../utils/convertFakeTimeToText';
import { HStack } from '../../layouts';
import { PressableOpacity } from '../../components';
import { TabContext } from '../../context/TabProvider';

type CodeResultProps = {
	translateY: Animated.SharedValue<number>;
	codeResult: string[];
	elapsedTime: number;
};

function keyExtractor(item: string, index: number): string {
	return `${item}-${index}`;
}

function renderItem(info: ListRenderItemInfo<string>): React.ReactElement {
	return <Text style={styles.line}>{info.item}</Text>
}

const CodeResult: React.FC<CodeResultProps> = ({codeResult, translateY, elapsedTime}) => {
	const {activeTab: {value: activeTab}} = useContext(TabContext);

	const [fakeTime, setFakeTime] = useState<number>(elapsedTime);
	const [fakeTimeText, setFakeTimeText] = useState<string>(() => convertFakeTimeToText(elapsedTime));
	const [fakeTimeInterval, setFakeTimeInterval] = useState<any>();

	const close = () => {
		translateY.value = withTiming(0);
	}

	const rStyle = useAnimatedStyle(() => ({
		transform: [{translateY: translateY.value}]
		})
	);

	useEffect(() => {
		const time = convertFakeTimeToText(fakeTime);
		setFakeTimeText(time);
	}, [fakeTime]);

	useEffect(() => {
		const sub = addTriggerFakeIntervalListener(() => {
			setFakeTime(0);

			const interval = setInterval(() => {
				setFakeTime(prev => prev + 10);
			}, 10);

			setFakeTimeInterval(interval);
		});

		return () => {
			sub.remove();
		}
	}, []);

	useEffect(() => {
		const time = activeTab?.lastExecution.elapsedTime ?? 0;
		setFakeTime(time);
		setFakeTimeText(convertFakeTimeToText(time));
	}, [activeTab]);

	useEffect(() => {
		if(codeResult.length !== 0) {
			clearInterval(fakeTimeInterval);
			setFakeTimeInterval(undefined);
		}
	}, [codeResult]);

  return (
    <Animated.View style={[styles.root, rStyle]}>
			<HStack justifyContent={"space-between"} style={{marginBottom: theme.spacing.s4}}>
				<HStack alignItems={"center"} gap={theme.spacing.s4}>
					<Text style={styles.title}>Ultima ejecucion</Text>
					{ fakeTime !== 0 ? (
							<Text style={styles.fakeTime}>{fakeTimeText}</Text>
						) : null
					}
				</HStack>
				<PressableOpacity onPress={close}>
					<IonIcon name={"ios-arrow-back"} color={theme.colors.editor.footerIconColor} size={theme.sizes.iconSize * 1.2} />
				</PressableOpacity>
			</HStack>
				{
					codeResult.length > 0 ? (
						<FlatList 
							data={codeResult}
							keyExtractor={keyExtractor}
							renderItem={renderItem}
						/>
					) : null
				}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
	root: {
		width: "100%",
		height: "50%",
		paddingTop: theme.spacing.s4,
		paddingHorizontal: theme.spacing.s4,
		backgroundColor: "#181818",
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "#292c2d",
		borderTopLeftRadius: theme.spacing.s4,
		borderTopRightRadius: theme.spacing.s4,
		position: "absolute",
		top: "100%",
		zIndex: 999
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s4
	},
	title: {
		fontFamily: theme.fonts.bold,
		fontSize: 22,
		color: "#fff"
	},
	fakeTime: {
		padding: theme.spacing.s1,
		borderRadius: theme.spacing.s1,
		backgroundColor: theme.colors.generic.infoBacgroundColor,
		color: theme.colors.generic.infoTextColor
	},
	icon: {
		alignSelf: "flex-end"
	},
	line: {
		fontFamily: theme.fonts.medium,
		fontSize: 16,
		color: "#afb1b3"
	}
});

export default CodeResult;
