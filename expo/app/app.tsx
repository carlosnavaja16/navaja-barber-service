import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { Button } from './common/components/button';
import { Link } from 'expo-router';
import { registerRootComponent } from 'expo';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        style={styles.image}
        source={require('../../../shared/assets/navajaLogo.png')}
      />
      <Link href="/user/login">
        <Button text="Login" />
      </Link>
      <Link href="/user/sign-up">
        <Button text="Sign Up" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: 150,
    marginBottom: 50
  }
});

registerRootComponent(App);
