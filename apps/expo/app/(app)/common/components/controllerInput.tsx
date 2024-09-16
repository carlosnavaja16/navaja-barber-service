import {
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  INPUT_HEIGHT,
  NAVAJA_RED
} from '../styles';

type ControlledInputProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  secureTextEntry?: boolean;
};

export const ControlledInput = <T extends FieldValues>(
  props: ControlledInputProps<T>
) => {
  const { field, fieldState } = useController<T>(props);
  const fieldInvalid = fieldState.invalid && fieldState.isTouched;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingBottom: fieldInvalid ? 0 : 10
    },
    label: {
      fontSize: 12
    },
    textInput: {
      width: '100%',
      height: INPUT_HEIGHT,
      borderRadius: BORDER_RADIUS,
      paddingLeft: 10,
      borderWidth: fieldInvalid ? 2 : BORDER_WIDTH,
      borderColor: fieldInvalid ? NAVAJA_RED : 'black'
    },
    errorMessage: {
      fontSize: 12,
      height: 10,
      color: NAVAJA_RED
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label} </Text>
      <TextInput
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        style={styles.textInput}
        secureTextEntry={props.secureTextEntry}
      />
      {fieldInvalid && (
        <Text style={styles.errorMessage}>{fieldState.error?.message}</Text>
      )}
    </View>
  );
};
