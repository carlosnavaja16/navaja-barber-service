import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator
} from 'react-native';
import {
  NAVAJA_BLUE,
  INPUT_HEIGHT,
  BORDER_RADIUS,
  NAVAJA_SLATE_200,
  NAVAJA_SLATE_400,
  BORDER_WIDTH
} from '../styles';

interface Props {
  disabled?: boolean;
  text: string;
  buttonColor?: string;
  textColor?: string;
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPress?: (...args: any[]) => any;
}

export const Button = (props: Props) => {
  const styles = getStyles(props);

  return (
    <Pressable
      style={styles.container}
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
  );
};

const getStyles = (props: Props) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
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
    }
  });
