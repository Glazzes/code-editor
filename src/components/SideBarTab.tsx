import React, { useContext, useEffect, useState } from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import IonIcon from '@expo/vector-icons/Ionicons';
import PressableOpacity from './PressableOpacity';

import {findTextSearchMatches, TextSearchMatch} from '../utils/findSearchMatches';
import {TabContent} from '../types/tabcontent';
import {TabContext} from '../context/TabProvider';
import {theme} from '../data/theme';
import {HStack} from '../layouts';

type SideBarTabProps = {
  tab: TabContent;
  searchTerm: string;
};

const SideBarTab: React.FC<SideBarTabProps> = ({tab, searchTerm}) => {
  const {activeTab: {value: activeTab, setActiveTab}, tabs: {value: tabs, setTabs}} 
    = useContext(TabContext);

  const isActiveTab = tab.id === activeTab?.id;
  const [nameMatches, setNameMatches] = useState<TextSearchMatch[]>([]);

  const setTabAsActiveTab = () => {
    setActiveTab(tab);
  }

  const removeTab = () => {
    if(isActiveTab) {
      let activeTabIndex = 0;
      for(let i = 0; i < tabs.length; i++) {
        activeTabIndex = i;
        if(tab.id == tabs[i].id) {
          break;
        }
      }

      if(activeTabIndex === undefined) throw Error("An active must be defined");

      if(tabs.length == 1) {
        setActiveTab(undefined);
      }

      if(activeTabIndex === 0 && tabs.length >= 2) {
        setActiveTab(tabs[1]);
      }

      if(activeTabIndex === tabs.length - 1 && tabs.length >= 2) {
        setActiveTab(tabs[tabs.length - 2]);
      }
    }

    setTabs(prev => prev.filter(t => {
      return t.id !== tab.id
    }));
  }

  useEffect(() => {
    const textMatches = findTextSearchMatches(tab.name, searchTerm);
    setNameMatches(textMatches);
  }, [tab.name, searchTerm]);

  return (
    <PressableOpacity onPress={setTabAsActiveTab}>
      <View style={[
        styles.tab, 
        {backgroundColor: isActiveTab ? theme.colors.sidebar.textInputBackgroundColor : undefined}
      ]}>  
        <HStack flex={1} gap={theme.spacing.s4} alignItems={"center"} justifyContent={"space-between"}>
          <HStack flex={1} gap={theme.spacing.s4} alignItems={"center"}>
            <View style={[styles.activeIndicator, {backgroundColor: isActiveTab ? "#fff" : undefined}]} />
            <Text style={styles.tabText} numberOfLines={1} ellipsizeMode={"tail"}>
              {
                nameMatches.map((match, index) => {
                  return <Text key={`${match.text}-${match.matches}-${index}`} style={[
                    styles.tabText,
                    {color: match.matches ? theme.colors.sidebar.textMatchFound : undefined}
                  ]}>{match.text}</Text>
                })
              }
            </Text>
          </HStack>
          <Pressable onPress={removeTab}>
            <IonIcon name={"ios-close"} color={"#fff"} size={theme.sizes.iconSize} />
          </Pressable>
        </HStack>
      </View>
    </PressableOpacity>
  )
};

const styles = StyleSheet.create({
  tab: {
    width: "100%",
    height: theme.sizes.touchableHeight,
    borderRadius: theme.spacing.s2,
    padding: theme.spacing.s4,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4
  },
  tabText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.sidebar.textColor
  },
  activeIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export default React.memo(SideBarTab);
