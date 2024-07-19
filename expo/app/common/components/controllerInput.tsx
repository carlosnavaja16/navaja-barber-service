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
  secureTextEntry?: boolean;
};

export const ControlledInput = <T extends FieldValues>(
  props: ControlledInputProps<T>
) => {
  const { field, fieldState, formState } = useController<T>(props);

  const fieldInvalid =
    fieldState.invalid &&
    fieldState.isTouched &&
    (fieldState.isDirty || formState.isSubmitted);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingBottom: fieldInvalid ? 0 : 10
    },
    textInput: {
      width: '100%',
      height: INPUT_HEIGHT,
      borderRadius: BORDER_RADIUS,
      paddingLeft: 10,
      textAlignVertical: 'center',
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
      <TextInput
        style={styles.textInput}
        {...field}
        placeholder={props.name}
        secureTextEntry={props.secureTextEntry}
      />
      {fieldInvalid && (
        <Text style={styles.errorMessage}>{fieldState.error?.message}</Text>
      )}
    </View>
  );
};
