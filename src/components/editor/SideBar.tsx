import React, { useState } from 'react';
import {View, Text, StyleSheet, useWindowDimensions, TextInput, FlatList, ListRenderItemInfo} from 'react-native';

import IonIcon from '@expo/vector-icons/Ionicons';
import Logo from '../Logo';
import User from '../User';

import {TabContent} from '../../types/tabcontent';
import {theme} from '../../data/theme';
import {ToolTipContainer} from '../../layouts';

type SideBarProps = {
  tabs: TabContent[];
}

function keyExtractor(item: TabContent, index: number): string {
  return `${item.id}-${index}`;
}

function renderItem(info: ListRenderItemInfo<TabContent>): React.ReactElement {
  return <div style={{fontFamily: theme.fonts.bold, color: "#fff"}}>{info.item.name}</div>
}

const SideBar: React.FC<SideBarProps> = ({tabs}) => {
  const {height} = useWindowDimensions();
  const sideBarHeight = height - theme.spacing.s2 * 2;

  return (
    <View style={[styles.sidebar, {height: sideBarHeight}]}>
      <View style={styles.hstack}>
        <Logo dark={false} />
        <View style={styles.searchBoxContainer}>
          <IonIcon name={"ios-search"} color={theme.colors.sidebar.iconColor} size={theme.sizes.iconSize} />
          <TextInput style={styles.searchBox} placeholder={"Search"} />
        </View>

        <ToolTipContainer content={"ctrl + a"}>
          <View style={styles.container}>
            <IonIcon name={"ios-add"} color={theme.colors.sidebar.iconColor} size={theme.sizes.iconSize} />
            <Text style={styles.text}>Nueva pestaña</Text>
          </View>
        </ToolTipContainer>
      </View>

      <FlatList 
        data={tabs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />

      <User />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 300,
    borderRadius: theme.spacing.s4,
    backgroundColor: theme.colors.sidebar.backgroundColor,
    padding: theme.spacing.s4,
    justifyContent: "space-between",
    gap: theme.spacing.s8
  },
  hstack: {
    gap: theme.spacing.s4
  },
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.spacing.s2,
    backgroundColor: theme.colors.sidebar.textInputBackgroundColor,
    overflow: "hidden",
  },
  searchBox: {
    flex: 1,
    height: theme.sizes.touchableHeight,
    color: theme.colors.sidebar.inputTextColor,
    outlineStyle: "none",
    fontFamily: theme.fonts.medium
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    height: theme.sizes.touchableHeight,
    borderColor: theme.colors.sidebar.textInputBackgroundColor,
    borderWidth: 2,
    borderRadius: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s4,
  },
  newTab: {
    width: "100%",
    height: theme.sizes.touchableHeight,
    borderRadius: theme.spacing.s2,
    backgroundColor: theme.colors.sidebar.textInputBackgroundColor,
    paddingHorizontal: theme.spacing.s4
  },
  text: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.sidebar.textColor
  }
});

export default SideBar;
