import { DrawerScreenProps } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Image, StyleSheet, View } from 'react-native';
import { Button } from '../components/button';
import {
  APPOINTMENTS_ROUTE,
  HOME_TYPE,
  LOGIN_ROUTE,
  SIGN_UP_ROUTE
} from '../constants/screens';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from '../constants/styles';
import { firebase } from '../firebase/firebase';
import { DrawerParams } from '../types/drawerParams';

const auth = getAuth(firebase);

export default function App({
  navigation
}: DrawerScreenProps<DrawerParams, HOME_TYPE>) {
  const [user] = useAuthState(auth);

  const goToLogin = () => {
    navigation.navigate(LOGIN_ROUTE);
  };
  const goToSignUp = () => {
    navigation.navigate(SIGN_UP_ROUTE);
  };

  useEffect(() => {
    if (user) {
      navigation.navigate(APPOINTMENTS_ROUTE);
    }
  });

  if (user) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require('../../../../packages/shared/assets/navajaLogo.png')}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={goToLogin} text="Login" />
          <Button onPress={goToSignUp} text="Sign Up" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: FORM_CONTAINER_GAP,
    width: '100%',
    paddingHorizontal: PADDING_HORIZONTAL
  },
  button: {
    width: '100%'
  },
  image: {
    width: 150,
    marginBottom: 50
  }
});
