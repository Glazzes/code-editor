import React, {useContext, useEffect, useState} from 'react';

import IonIcons from '@expo/vector-icons/Ionicons';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import { 
    Text,
    useWindowDimensions, 
    FlatList, 
    ListRenderItemInfo,
    StyleSheet,
    View,
    Pressable,
} from 'react-native';
import { runningContext } from './RunningContext';
import {emitter} from './utils/eventlistener';

function keyExtrator(item: string, index: number) {
  return `${item}-${index}`;
}

function renderItem(info: ListRenderItemInfo<string>) {
  return (
    <Text style={styles.text}>{info.item}</Text>
  )
}

const RunResult: React.FC = () => {
  const [isRunning] = useContext(runningContext);
  const [data, setData] = useState<string[]>([]);

  const {height} = useWindowDimensions();
  const translateY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
        width: "100%",
        height: height / 2,
        position: 'absolute',
        top: height,
        transform: [{translateY: translateY.value}],
        backgroundColor: "#252525",
      }
  }); 

  const closeTab = () => {
    translateY.value = withTiming(0, {duration: 300});
  };

  useEffect(() => {
    const displayData = emitter.addListener("display-data", (data: string[]) => {
      setData(data);
    });

    const displayTab = emitter.addListener("display-tab", () => {
      translateY.value = withTiming(-1 * height / 2, {duration: 300});
    });

    return () => {
      displayData.remove();
      displayTab.remove();
    }
  }, []);

  return (
    <Animated.View style={[{transform: [{translateY: height}]}, animatedStyles]}> 
      {
        isRunning ? (
            <View style={styles.loading}>

            </View>
        ) 
        : (
          <FlatList 
            style={{flex: 1}}
            contentContainerStyle={styles.content}
            data={data}
            keyExtractor={keyExtrator}
            renderItem={renderItem}
          />
        )
      }
      <Pressable onPress={closeTab} style={styles.close}>
        <IonIcons name={"close"} size={24} color={"#fff"} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Bold",
    color: "#fff",
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  close: {
    position: 'absolute',
    top: 16,
    right: 16
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  }
});

export default RunResult;