import React, { useState } from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [counterInterval, setCounterInterval] = useState(undefined);

  const onClick = () => {
    const timer = setInterval(() => {
        setTime(prev => (prev + 10 * Math.random()))
    }, 10);

    setCounterInterval(timer);
  }

  return (
    <View style={styles.root}>
      <span>{time.toFixed(1)}</span>
      <button onClick={onClick}>Start</button>
      <button onClick={() => clearInterval(counterInterval)}>Stop</button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Timer;
