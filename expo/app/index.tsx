import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Button } from './common/components/button';
import { Link } from 'expo-router';
import 'expo-router/entry';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        style={styles.image}
        source={require('../../shared/assets/navajaLogo.png')}
      />
      <Link href="user/login" asChild>
        <Pressable>
          <Button text="Login" />
        </Pressable>
      </Link>
      <Link href="user/sign-up" asChild>
        <Pressable>
          <Button text="Sign Up" />
        </Pressable>
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
