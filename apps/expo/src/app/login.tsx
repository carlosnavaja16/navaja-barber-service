import { EMAIL_REGEX } from '@navaja/shared';
import { useNavigation } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/button';
import { ControlledInput } from '../components/controllerInput';
import { APPOINTMENTS, goToAppointments } from '../constants/routes';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from '../constants/styles';
import { firebase } from '../firebase/firebase';
import { useEffect } from 'react';

type LoginFormData = {
  email: string;
  password: string;
};

const auth = getAuth(firebase);

export default function Login() {
  const [user, loading] = useAuthState(auth);
  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
      navigation.navigate(APPOINTMENTS);
    }
  });
  const {
    control,
    formState: { isValid },
    getValues
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });
  const login = () => {
    const { email, password } = getValues();
    signInWithEmailAndPassword(auth, email, password).then(() => {
      goToAppointments();
    });
  };

  if (user) {
    // Don't show anything if the user is already logged in
    return null;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <ControlledInput
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: EMAIL_REGEX,
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
          <Button
            text="Login"
            onPress={login}
            loading={loading}
            disabled={isValid ? false : true}
          />
        </View>
      </View>
    );
  }
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
