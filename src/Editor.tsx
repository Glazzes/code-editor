import React, {useEffect, useState} from 'react';

import AceEditor from "react-ace";
import Tabs from './Tabs';

import {TabContent} from './types/tabcontent';
import {emitter} from './utils/eventlistener';
import {View, StyleSheet, useWindowDimensions, Pressable} from 'react-native';
import {v4 as uuid} from 'uuid';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-python";

import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-xcode";

import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

type EditorProps = {};

const startingTab: TabContent = {id: uuid(), name: "New tab", code: [], language: "Java"};

const Editor: React.FC<EditorProps> = ({}) => {
  const {width} = useWindowDimensions();

  const [tabs, setTabs] = useState<TabContent[]>([]);
  const [activeTab, setActiveTab] = useState<TabContent>(startingTab);

  const onEditorTextChange = (text: string) => {
    setActiveTab(t => {
      if(t !== undefined) {
        t.code = text.split("\n");
      }

      return t;
    });

    persistsTabs();
  }

  const persistsTabs = () => {
    const tabsString = JSON.stringify(tabs);
    const activeTabString = JSON.stringify(activeTab);

    localStorage.setItem("tabs", tabsString);
    localStorage.setItem("active-tab", activeTabString);
  }

  useEffect(() => {
    const tabString = localStorage.getItem("tabs");
    const activeTabString = localStorage.getItem("active-tab");
    if(tabString && activeTabString) {
      const tabs: TabContent[] = JSON.parse(tabString);
      const activeTab: TabContent = JSON.parse(activeTabString);

      setTabs(tabs);
      setActiveTab(activeTab);
    }else {
      setTabs([startingTab]);
      setActiveTab(startingTab);
    }
  }, [])

  useEffect(() => {
    const setActiveSubscription = emitter.addListener("active-tab", (tab: TabContent) => {
      setActiveTab(tab);
      localStorage.setItem("active-tab", JSON.stringify(tab));
    });

    const createNewTabSubscription = emitter.addListener("create-tab", (tab: TabContent) => {
      setTabs(t => [...t, tab]);
      setActiveTab(tab);

      localStorage.setItem("active-tab", JSON.stringify(tab));
    });

    const displayResult = emitter.addListener("display-result", (result: string[]) => {
      console.log(result);
    })

    return () => {
      setActiveSubscription.remove();
      createNewTabSubscription.remove();
      displayResult.remove();
    }
  }, []);

  useEffect(() => {
    const subscription = emitter.addListener("delete-tab", 
    (tab: TabContent, index: number) => {
      const isLastTab = index === tabs.length - 1;
      const isActiveTab = activeTab?.id == tab.id
      let newActiveTab;

      if(index === 0 && tabs.length === 1) {
        localStorage.clear();
      }
       
      if(isLastTab && isActiveTab) {
        newActiveTab = tabs[index - 1];
        emitter.emit("active-tab", tabs[index - 1]);
      }

      if(!isLastTab && isActiveTab) {
        newActiveTab = tabs[index + 1];
        emitter.emit("active-tab", tabs[index + 1]);
      }

      if(newActiveTab) {
        setActiveTab(newActiveTab);
      }

      setTabs((t) => t.filter((item) => item.id != tab.id));

      return () => subscription.remove();
    }, [tabs, activeTab]);

    return () => {
      subscription.remove();
    }
  }, [tabs, activeTab])

  return (
    <View style={styles.root}>
      <Tabs tabs={tabs} activeTab={activeTab} />
      <AceEditor
        mode={activeTab?.language.toLocaleLowerCase() ?? "java"}
        theme={"one_dark"}
        tabSize={4}
        value={activeTab?.code.join("\n") ?? ""}
        onChange={onEditorTextChange}
        placeholder="Let's write some awesome code!"
        focus={true}
        showPrintMargin={false}
        style={{flex: 1, width, paddingTop: 16, paddingBottom: 16}}
        setOptions={{
          enableLiveAutocompletion: true,
          enableBasicAutocompletion: true,
          showLineNumbers: true,
          fontSize: 16,
          animatedScroll: true,
          newLineMode: true,
          wrap: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Editor;