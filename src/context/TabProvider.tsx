import React, {useEffect, useState} from 'react';
import {TabContent} from '../types/tabcontent';

type TabContextProps = {
  children: React.ReactNode;
}

type Context = {
  activeTab: {
    value: TabContent | undefined;
    setActiveTab: React.Dispatch<React.SetStateAction<TabContent | undefined>>;
  },
  tabs: {
    value: TabContent[];
    setTabs: React.Dispatch<React.SetStateAction<TabContent[]>>
  }
}

export const TabContext = React.createContext<Context>({} as Context);

const TabsProvider: React.FC<TabContextProps> = ({children}) => {
  const [activeTab, setActiveTab] = useState<TabContent>();
  const [tabs, setTabs] = useState<TabContent[]>([]);

  const value: Context = {
    activeTab: {
      value: activeTab,
      setActiveTab
    },
    tabs: {
      value: tabs,
      setTabs
    }
  }

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  )
}

export default TabsProvider;
