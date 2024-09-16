import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../common/firebase/firebase';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button } from '../common/components/button';
import { ControlledInput } from '../common/components/controllerInput';
import { setHeaderText } from '../common/store/header/headerSlice';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from '../common/styles';
import { useAppDispatch } from '../common/store/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { EMAIL_REGEX } from '@navaja/shared';
import { APPOINTMENTS, goToAppointments } from '../common/routes';
import { useEffect } from 'react';
import { Redirect } from 'expo-router';

type LoginFormData = {
  email: string;
  password: string;
};

const auth = getAuth(firebase);

export default function Login() {
  /**
   * Set the header text, must be in an effect to avoid rendering
   * a parent component (Header) while rendering this one.
   */
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHeaderText('Login'));
  });

  const [user, loading] = useAuthState(auth);

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
    return <Redirect href={APPOINTMENTS} />;
  }

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
