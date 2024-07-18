import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import {
  NAVAJA_BLUE,
  INPUT_HEIGHT,
  BORDER_RADIUS,
  NAVAJA_SLATE_200,
  NAVAJA_SLATE_400,
  BORDER_WIDTH
} from '../styles/styles';

interface Props {
  disabled?: boolean;
  text: string;
  buttonColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export const Button = (props: Props) => {
  const styles = StyleSheet.create({
    button: {
      height: INPUT_HEIGHT,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: BORDER_WIDTH,
      borderRadius: BORDER_RADIUS,
      backgroundColor: props.disabled
        ? NAVAJA_SLATE_200
        : props.buttonColor || NAVAJA_BLUE,
      borderColor: props.disabled ? NAVAJA_SLATE_400 : 'black'
    },
    text: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: props.disabled ? NAVAJA_SLATE_400 : props.textColor || 'white'
    }
  });

  return (
    <Pressable
      style={styles.button}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
};
