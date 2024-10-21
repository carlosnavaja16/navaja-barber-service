import {
  EMAIL_EMPTY,
  EMAIL_INVALID,
  EMAIL_REGEX,
  PASSWORD_EMPTY,
  PASSWORD_INVALID
} from '@navaja/shared';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/button';
import { ControlledInput } from '../components/controllerInput';
import { APPOINTMENTS_ROUTE, LOGIN_TYPE } from '../constants/screens';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from '../constants/styles';
import { firebase } from '../firebase/firebase';
import { DrawerParams } from '../types/drawerParams';

type LoginFormData = {
  email: string;
  password: string;
};

const auth = getAuth(firebase);

export default function Login({
  navigation
}: DrawerScreenProps<DrawerParams, LOGIN_TYPE>) {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      navigation.navigate(APPOINTMENTS_ROUTE);
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
      navigation.navigate(APPOINTMENTS_ROUTE);
    });
  };

  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <ControlledInput
          control={control}
          name="email"
          rules={{
            required: EMAIL_EMPTY,
            pattern: {
              value: EMAIL_REGEX,
              message: EMAIL_INVALID
            }
          }}
          label="Email"
        />
        <ControlledInput
          control={control}
          name="password"
          rules={{
            required: PASSWORD_EMPTY,
            minLength: {
              value: 6,
              message: PASSWORD_INVALID
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
