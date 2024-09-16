import 'expo-router/entry';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { Button } from './(app)/common/components/button';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from './(app)/common/styles';
import { APPOINTMENTS, goToLogin, goToSignUp } from './(app)/common/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebase } from './(app)/common/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { Redirect } from 'expo-router';

const auth = getAuth(firebase);

export default function App() {
  const [user] = useAuthState(auth);
  if (user) {
    return <Redirect href={APPOINTMENTS} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        style={styles.image}
        source={require('../../../packages/shared/assets/navajaLogo.png')}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={goToLogin} text="Login" />
        <Button onPress={goToSignUp} text="Sign Up" />
      </View>
    </View>
  );
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
    resizeMode: 'contain',
    width: 150,
    marginBottom: 50
  }
});
