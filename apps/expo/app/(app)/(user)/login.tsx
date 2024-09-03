import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button } from '../common/components/button';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from '../common/styles';
import { ControlledInput } from '../common/components/controllerInput';
import { useAppDispatch } from '../store/hooks';
import { setHeaderText } from '../header/state/headerSlice';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    formState: { isValid }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const dispatch = useAppDispatch();
  dispatch(setHeaderText('Login'));

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <ControlledInput
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: 'Invalid email'
            }
          }}
          label="Email"
        />
        <ControlledInput
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          label="Password"
          secureTextEntry={true}
        />
        <Button text="Login" disabled={isValid ? false : true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: FORM_CONTAINER_GAP,
    paddingHorizontal: PADDING_HORIZONTAL
  }
});
