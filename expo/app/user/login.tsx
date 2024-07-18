import { Header } from '../common/components/header';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button } from '../common/components/button';
import { GAP } from '../common/styles/styles';
import { ControlledInput } from '../common/components/controllerInput';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'all'
  });

  const onSubmit = (data: LoginFormData) => console.log(data);

  return (
    <View style={styles.container}>
      <Header text="Login" />
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
          placeholder="Email"
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
          placeholder="Password"
        />
        <Button
          text="Login"
          onPress={handleSubmit(onSubmit)}
          disabled={isValid ? false : true}
        />
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
    gap: GAP,
    paddingHorizontal: 20
  }
});
