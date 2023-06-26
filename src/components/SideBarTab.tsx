import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';

import PressableOpacity from './PressableOpacity';
import {TabContent} from '../types/tabcontent';

import {findTextSearchMatches, TextSearchMatch} from '../utils/findSearchMatches';
import {theme} from '../data/theme';

type SideBarTabProps = {
  tab: TabContent;
  activeTabId?: string;
  searchTerm: string;
};

const SideBarTab: React.FC<SideBarTabProps> = ({tab, activeTabId, searchTerm}) => {
  const isActiveTab = tab.id === activeTabId;

  const [nameMatches, setNameMatches] = useState<TextSearchMatch[]>([]);

  useEffect(() => {
    const textMatches = findTextSearchMatches(tab.name, searchTerm);
    setNameMatches(textMatches);
  }, [tab.name, searchTerm]);

  return (
    <PressableOpacity onPress={() => {}}>
      <View style={[
        styles.tab, 
        {backgroundColor: isActiveTab ? theme.colors.sidebar.textInputBackgroundColor : undefined}
      ]}>  
        <View style={[styles.activeIndicator, {backgroundColor: isActiveTab ? "#fff" : undefined}]} />
        <Text style={styles.tabText} numberOfLines={1} ellipsizeMode={"tail"}>
          {
            nameMatches.map(match => {
              return <Text style={[
                styles.tabText,
                {color: match.matches ? theme.colors.sidebar.textMatchFound : undefined}
              ]}>{match.text}</Text>
            })
          }
        </Text>
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