import { Header } from '../common/components/header';
import { TextInput, View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../common/components/button';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit = (data: LoginFormData) => console.log(data);

  return (
    <View>
      <Header text="Login" />
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      <View style={styles.buttonContainer}>
        <Button
          text="Login"
          buttonColor="red"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5
  }
});
