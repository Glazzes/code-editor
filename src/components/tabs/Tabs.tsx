import React, {useContext, useEffect, useState} from 'react';

import Tab from './Tab';
import IonIcons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedReaction,
  measure,
  scrollTo
} from 'react-native-reanimated';

import {View, StyleSheet, Pressable, Text, useWindowDimensions, ScrollView} from 'react-native';
import {emitter} from '../../utils/eventlistener';
import {TabContent} from '../../types/tabcontent';
import {runningContext} from '../editor/RunningContext';
import {useAnimatedRef} from 'react-native-reanimated';

type TabsProps = {
  tabs: TabContent[];
  activeTab: TabContent;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Tabs: React.FC<TabsProps> = ({tabs, activeTab}) => {
  const [isRunning, setIsRunning] = useContext(runningContext);
  const [showRight, setShowRight] = useState<boolean>(false);
  const [showLeft, setShowLeft] = useState<boolean>(false);

  const {width} = useWindowDimensions();

  const scroll = useSharedValue<number>(0);
  const tabsWidth = useSharedValue<number>(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const plusRef = useAnimatedRef();
  const runRef = useAnimatedRef();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: tabsWidth.value,
    };
  });

  useAnimatedReaction(
    () => width,
    (w) => {
      const plusMeasure = measure(plusRef);
      const runMeasure = measure(runRef);
      if(plusMeasure && runMeasure) {
        tabsWidth.value = w - plusMeasure.width - runMeasure.width - 56;
      }
    },
    [width]
  );

  const showNewTablModal = () => {
    emitter.emit("show-modal");
  }

  const runCode = async () => {
    if(!isRunning) {
      try{
        const data = await (await fetch("http://140.238.187.124:5000/api/run", {
          method: "POST", 
          body: JSON.stringify({language: activeTab.language, code: activeTab.code})
        })).json()
        
        emitter.emit("display-data", data.Output);
      }catch(e) {
        console.error(e);
      }finally {
        setIsRunning(false);
      }
    }
  }

  useEffect(() => {
    const saveTabs = setTimeout(() => {
      const tabsString = JSON.stringify(tabs);
      const activeTabString = JSON.stringify(activeTab);

      localStorage.setItem("tabs", tabsString);
      localStorage.setItem("last-active-tab", activeTabString);
    }, 1000);

    return () => {
      clearTimeout(saveTabs);
    }
  }, [tabs, activeTab]);

  return (
    <View style={styles.statusbar}>
      <AnimatedPressable ref={plusRef} onPress={showNewTablModal} style={[styles.newTab]}>
          <IonIcons name='add' color={"#a9a9a9"} size={24} />
        </AnimatedPressable>

      <Animated.View style={[animatedStyle, styles.tabContainer]}>
          <Animated.ScrollView 
            ref={scrollRef}
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
          >
            {
              tabs.map((t, index) => {
                return <Tab key={t.id} index={index} tab={t} activeTabId={activeTab.id} />
              })
            }
            <View style={{height: 30, width: 30, backgroundColor: "lime", position: 'absolute', left: 0}} />
          </Animated.ScrollView>
      </Animated.View>

      <AnimatedPressable 
        ref={runRef}
        onPress={() => {
          runCode()
          setIsRunning(true);
          emitter.emit("display-tab")
        }}
        style={[styles.run, isRunning ? styles.runDisabled : styles.runEnabled]}
        >
        <IonIcons name={"play"} size={20} color={isRunning ? "#c4c4ca" : "#fff"} />
        <Text style={isRunning ? styles.runTextDisabled : styles.runText}>Run</Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  statusbar: {
    width: "100%",
    height: 50,
    paddingHorizontal: 8,
    backgroundColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    overflow: "hidden"
  },
  newTab: {
    height: 38,
    width: 38,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#212121",
    backgroundColor: "#2f2f2f",
    justifyContent: "center",
    alignItems: "center",
  },
  run: {
    height: 38,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16
  },
  runEnabled: {
    backgroundColor: "#2c55fb",
  },
  runDisabled: {
    backgroundColor: "#f3f3f4"
  },
  runText: {
    color: "#fff",
    fontFamily: "Bold"
  },
  runTextDisabled: {
    color: "#c4c4ca",
    fontFamily: "Bold"
  }
});

export default Tabs;