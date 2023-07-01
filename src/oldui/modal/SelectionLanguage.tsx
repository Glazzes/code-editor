import React, {Dispatch, SetStateAction} from 'react';

import {StyleSheet, Image, Pressable} from 'react-native';
import {Language} from '../../types/language';

import '../../../assets/css/utils.css';

type SelectionLanguageProps = {
  language: Language | undefined;
  activeLanguage: Language | undefined;
  setLanguage: Dispatch<SetStateAction<Language | undefined>>
};

const SelectionLanguage: React.FC<SelectionLanguageProps> = ({language, activeLanguage, setLanguage}) => {
  const isActive = language === activeLanguage;

  return (
    <Pressable onPress={() => setLanguage(language)}>
      <div className={isActive ? "" : "greyscale"} >
        <Image 
          source={require(`../../../assets/images/${language?.toLocaleLowerCase()}.png`)}
          style={styles.image}
          resizeMode={"contain"}
        />
      </div>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 44,
    width: 44,
  }
});

export default SelectionLanguage;
