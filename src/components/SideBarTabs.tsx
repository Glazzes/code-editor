import React from 'react';
import {View, Text} from 'react-native';
import { TabContent } from '../types/tabcontent';

type SideBarTabsProps = {
    tabs: TabContent[];
};

const SideBarTabs: React.FC<SideBarTabsProps> = ({tabs}) => {
  return (
    <View>
      <Text>Welcome to SideBarTabs</Text>
    </View>
  );
};

export default SideBarTabs;