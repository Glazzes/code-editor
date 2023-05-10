import React, {useEffect, useState} from 'react';

import SelectionLanguage from './SelectionLanguage';

import {View, Text, StyleSheet, Pressable, TextInput} from 'react-native';
import {Language} from '../../types/language';
import {v4 as uuid} from 'uuid';
import { TabContent } from '../../types/tabcontent';
import { emitter } from '../../utils/eventlistener';

const languages: Language []= ["Java", "Javascript", "Python", "Golang", "Bash"];

const NewTabModal: React.FC = () => {
  const [isButtonDisabled, setIsDisabled] = useState<boolean>(true);

  const [name, setName] = useState<string>("");
  const [language, setLanguage] = useState<Language | undefined>();

  const createNewTab = () => {
    if(name === "" || language == undefined) {
      return;
    }

    const newTab: TabContent = {
      id: uuid(),
      name,
      code: [],
      language: language ?? "Java"
    }

    emitter.emit("create-tab", newTab);
  }

  useEffect(() => {
    if(name === "" || language == undefined) {
      setIsDisabled(true);
    }

    if(name != "" && language != undefined) {
      setIsDisabled(false);
    }
  }, [name, language]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Create new tab</Text>
      <Text style={styles.label}>Tab name</Text>
      <TextInput 
        onChangeText={(text) => setName(text)}
        placeholder={"Test"} 
        placeholderTextColor={"#737373"} 
        style={styles.input} 
      />
      <Text style={styles.label}>Select a language</Text>
      <View style={styles.languages}>
        { 
          languages.map((lang, index) => {
            return <SelectionLanguage 
              key={`${lang}-${index}`} 
              language={lang}
              activeLanguage={language}
              setLanguage={setLanguage}
            />
          }) 
        }
      </View>
      <Pressable
        onPress={createNewTab} 
        style={[
          styles.button,
          isButtonDisabled ? styles.disabed : styles.enabled
      ]}>
        <Text style={[
          styles.buttonText,
          isButtonDisabled ? styles.buttonTextDisabed : styles.buttonTextEnable
        ]}>
          let's code
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: 290,
    padding: 16,
    backgroundColor: '#141414',
    borderRadius: 8
  },
  title: {
    color: "#fff",
    fontFamily: "Bold",
    fontSize: 20,
    marginBottom: 32
  },
  label: {
    color: "#f5f5f5",
    fontFamily: "Medium",
    marginBottom: 8
  },
  input: {
    height: 44,
    borderRadius: 8,
    fontFamily: "Medium",
    backgroundColor: "#212121",
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#f5f5f5",
  },
  languages: {
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16
  },
  disabed: {
    backgroundColor: "#f2f4f5"
  },
  enabled: {
    backgroundColor: "#355ff0",
  },
  buttonText: {
    padding: 16,
    fontFamily: "Medium"
  },
  buttonTextEnable: {
    color: "#fff",
  },
  buttonTextDisabed: {
    color: "#141414"
  }
});

export default NewTabModal;