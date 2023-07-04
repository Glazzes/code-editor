import React, { useContext, useEffect, useState } from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import IonIcon from '@expo/vector-icons/Ionicons';
import PressableOpacity from './PressableOpacity';

import {findTextSearchMatches, TextSearchMatch} from '../utils/findSearchMatches';
import {TabContent} from '../types/tabcontent';
import {TabContext} from '../context/TabProvider';
import {theme} from '../data/theme';
import {HStack} from '../layouts';
import { activeTabLSId } from '../data/constants';
import databaseService from '../lib/db';

type SideBarTabProps = {
  tab: TabContent;
  index: number;
  searchTerm: string;
};

const SideBarTab: React.FC<SideBarTabProps> = ({tab, index, searchTerm}) => {
  const {activeTab: {value: activeTab, setActiveTab}, tabs: {value: tabs, setTabs}} 
    = useContext(TabContext);

  const isActiveTab = tab.id === activeTab?.id;
  const [nameMatches, setNameMatches] = useState<TextSearchMatch[]>([]);

  const setTabAsActiveTab = () => {
    setActiveTab(tab);
    localStorage.setItem(activeTabLSId, tab.id);
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
        localStorage.setItem(activeTabLSId, tabs[1].id);
      }

      if(activeTabIndex === tabs.length - 1 && tabs.length >= 2) {
        setActiveTab(tabs[tabs.length - 2]);
        localStorage.setItem(activeTabLSId, tabs[tabs.length - 2].id);
      }
    }

    databaseService.deleteTabById(tab.id);
    setTabs(prev => prev.filter(t => t.id !== tab.id));
  }

  const updateActiveTab = (e: KeyboardEvent) => {
    if(e.altKey && "123456789".indexOf(e.key) != -1) {
      e.stopPropagation();
      e.preventDefault();

      const newActiveTabIndex = parseInt(e.key, 10);
      if(newActiveTabIndex === index + 1) {
        const newActiveTab = tabs[index];
        if(newActiveTab !== undefined) {
          setActiveTab(newActiveTab);
          localStorage.setItem(activeTabLSId, newActiveTab.id);
        }
      }
    }
  }

  useEffect(() => {
    const closeTabShortcut = (e: KeyboardEvent) => {
      if(e.altKey && e.key === "k" && isActiveTab) {
        removeTab();
      }
    }

    window.addEventListener("keyup", closeTabShortcut);
    window.addEventListener("keyup", updateActiveTab);
    return () => {
      window.removeEventListener("keyup", closeTabShortcut);
      window.removeEventListener("keyup", updateActiveTab);
    };
  }, [tab, activeTab]);

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
