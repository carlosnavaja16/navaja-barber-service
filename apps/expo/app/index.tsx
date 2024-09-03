import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { Button } from './(app)/common/components/button';
import { router } from 'expo-router';
import 'expo-router/entry';
import { FORM_CONTAINER_GAP, PADDING_HORIZONTAL } from './(app)/common/styles';

export default function App() {
  const goToLogin = () => router.push('login');
  const goToSignUp = () => router.push('sign-up');

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
