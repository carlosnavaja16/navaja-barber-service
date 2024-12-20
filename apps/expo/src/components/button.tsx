import { TODO } from '@navaja/shared';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  BTN_SHADOW_OFFSET,
  INPUT_HEIGHT,
  NAVAJA_BLUE,
  NAVAJA_SLATE_200,
  NAVAJA_SLATE_400
} from '../constants/styles';

interface Props {
  disabled?: boolean;
  text: string;
  buttonColor?: string;
  textColor?: string;
  loading?: boolean;
  onPress?: (...args: TODO[]) => TODO;
}

export const Button = (props: Props) => {
  const styles = getStyles(props);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <View style={styles.emptyContainer} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.text}</Text>
        </View>
        <View style={styles.loadingContainer}>
          {props.loading && (
            <ActivityIndicator
              size="small"
              color={props.textColor || 'white'}
            ></ActivityIndicator>
          )}
        </View>
      </Pressable>
      <View style={styles.shadow} />
    </View>
  );
};

const getStyles = (props: Props) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: INPUT_HEIGHT + BTN_SHADOW_OFFSET,
      width: '100%'
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      height: INPUT_HEIGHT,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: BORDER_WIDTH,
      borderRadius: BORDER_RADIUS,
      backgroundColor: props.disabled
        ? NAVAJA_SLATE_200
        : props.buttonColor || NAVAJA_BLUE,
      borderColor: props.disabled ? NAVAJA_SLATE_400 : 'black',
      marginEnd: BTN_SHADOW_OFFSET
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingRight: 10
    },
    textContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: props.disabled ? NAVAJA_SLATE_400 : props.textColor || 'white'
    },
    emptyContainer: {
      flex: 1
    },
    shadow: {
      height: INPUT_HEIGHT,
      flex: 1,
      backgroundColor: 'black',
      zIndex: -1,
      borderRadius: BORDER_RADIUS,
      marginTop: -1 * INPUT_HEIGHT + BTN_SHADOW_OFFSET,
      marginLeft: BTN_SHADOW_OFFSET
    }
  });
