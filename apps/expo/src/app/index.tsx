import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Image, StyleSheet, View } from 'react-native';
import { Button } from '../components/button';
import { APPOINTMENTS, LOGIN, SIGN_UP } from '../constants/routes';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from '../constants/styles';
import { firebase } from '../firebase/firebase';
import { useEffect } from 'react';
import { DrawerScreenParams } from '../types/drawerScreenParams';
import { DrawerScreenProps } from '@react-navigation/drawer';

const auth = getAuth(firebase);

export default function App({
  navigation
}: DrawerScreenProps<DrawerScreenParams, 'index'>) {
  const [user] = useAuthState(auth);

  const goToLogin = () => {
    navigation.navigate(LOGIN);
  };
  const goToSignUp = () => {
    navigation.navigate(SIGN_UP);
  };

  useEffect(() => {
    if (user) {
      navigation.navigate(APPOINTMENTS);
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
