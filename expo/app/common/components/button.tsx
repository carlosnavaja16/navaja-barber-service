import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { blue } from '../styles/global.styles';

interface Props {
  text: string;
  buttonColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export const Button = (props: Props) => {
  const styles = StyleSheet.create({
    button: {
      height: 36,
      width: '100%',
      maxWidth: 300,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      borderRadius: 7,
      backgroundColor: props.buttonColor || blue,
      borderColor: 'black',
      borderWidth: 1
    },
    text: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: props.textColor || 'white'
    }
  });

  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
};
