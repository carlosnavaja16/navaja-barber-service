import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { Button } from './common/components/button';
import { router } from 'expo-router';
import 'expo-router/entry';
import { GAP, PADDING_HORIZONTAL } from './common/styles/styles';

export default function App() {
  const goToLogin = () => router.push('user/login');
  const goToSignUp = () => router.push('user/sign-up');

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        style={styles.image}
        source={require('../../shared/assets/navajaLogo.png')}
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
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: GAP,
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
