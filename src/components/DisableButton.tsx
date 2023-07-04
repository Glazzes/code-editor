import React, { useState } from 'react';
import {View, Text, ViewStyle, Pressable} from 'react-native';

type DisableButtonProps = {
  onPress: () => void;
  text: string;
  style: ViewStyle;
  disabledStyle: ViewStyle;
};

const DisableButton: React.FC<DisableButtonProps> = ({onPress, style, disabledStyle, text}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  return (
    <Pressable onPress={onPress} style={isDisabled ? style : disabledStyle}>
      <Text>{text}</Text>
    </Pressable>
  );
};

export default DisableButton;
