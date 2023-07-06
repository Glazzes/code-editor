import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { theme } from '../data/theme';
import { addTriggerFakeIntervalListener } from '../lib/emitter';

type CodeResultProps = {
	translateY: Animated.SharedValue<number>;
	width: Animated.SharedValue<number>;
	height: Animated.SharedValue<number>;
	codeResult: string[];
};

function keyExtractor(item: string, index: number): string {
	return `${item}-${index}`;
}

function renderItem(info: ListRenderItemInfo<string>): React.ReactElement {
	return <Text>{info.item}</Text>
}

const CodeResult: React.FC<CodeResultProps> = ({codeResult, translateY, width, height}) => {
	const hasBeenActivated = useSharedValue<boolean>(false);

	const [fakeTime, setFakeTime] = useState<number>(0);
	const [fakeTimeInterval, setFakeTimeInterval] = useState<any>();

	const rStyle = useAnimatedStyle(() => {
		return {
			width: width.value,
			height: height.value / 2,
			transform: [{translateY: -1 * height.value / 2}]
		};
	});

	useEffect(() => {
		const sub = addTriggerFakeIntervalListener(() => {
			setFakeTime(0);

			const interval = setInterval(() => {
				setFakeTime(prev => prev + 10);
			}, 10);

			setFakeTimeInterval(interval);
		});

		return sub.remove
	}, []);

	useEffect(() => {
		if(codeResult.length !== 0) {
			clearInterval(fakeTimeInterval);
			setFakeTimeInterval(undefined);
		}
	}, [codeResult])

  return (
    <Animated.View style={[styles.root, rStyle]}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Ultima ejecucion</Text>
				{ fakeTime !== 0 ? (
						<Text>{fakeTime}</Text>
					) : null
				}
			</View>
				{
					codeResult.length > 0 ? (
						<FlatList 
							data={codeResult}
							keyExtractor={keyExtractor}
							renderItem={renderItem}
							contentContainerStyle={styles.contentContainer}
						/>
					) : null
				}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
	root: {
		backgroundColor: "#fff",
		borderTopLeftRadius: theme.spacing.s2,
		position: "absolute",
		top: "100%",
		zIndex: 999
	},
	titleContainer: {
		flexDirection: "row",
		gap: theme.spacing.s4
	},
	title: {
		fontFamily: theme.fonts.bold,
		fontSize: 20
	},
	contentContainer: {
		paddingHorizontal: theme.spacing.s4
	}
});

export default CodeResult;
