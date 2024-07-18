import {
  FieldValues,
  useController,
  UseControllerProps
} from 'react-hook-form';
import { TextInput, StyleSheet, Text, View } from 'react-native';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  INPUT_HEIGHT,
  NAVAJA_RED
} from '../styles/styles';

type ControlledInputProps<T extends FieldValues> = UseControllerProps<T> & {
  placeholder?: string;
  errorMessage?: string;
};

export const ControlledInput = <T extends FieldValues>(
  props: ControlledInputProps<T>
) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingBottom: props.errorMessage ? 0 : 10
    },
    textInput: {
      width: '100%',
      height: INPUT_HEIGHT,
      borderRadius: BORDER_RADIUS,
      paddingLeft: 10,
      textAlignVertical: 'center',
      borderWidth: props.errorMessage ? 2 : BORDER_WIDTH,
      borderColor: props.errorMessage ? NAVAJA_RED : 'black'
    },
    errorMessage: {
      fontSize: 12,
      height: 10,
      color: NAVAJA_RED
    }
  });

  const { field, fieldState } = useController<T>(props);

  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} {...field} placeholder={props.name} />
      {fieldState.error && (
        <Text style={styles.errorMessage}>{props.errorMessage}</Text>
      )}
    </View>
  );
};
