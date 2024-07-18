import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Button } from './common/components/button';
import { Link } from 'expo-router';
import 'expo-router/entry';
import { GAP, PADDING_HORIZONTAL } from './common/styles/styles';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        style={styles.image}
        source={require('../../shared/assets/navajaLogo.png')}
      />
      <View style={styles.buttonContainer}>
        <Link href="user/login" asChild>
          <Pressable style={styles.button}>
            <Button text="Login" />
          </Pressable>
        </Link>
        <Link href="user/sign-up" asChild>
          <Pressable style={styles.button}>
            <Button text="Sign Up" />
          </Pressable>
        </Link>
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
