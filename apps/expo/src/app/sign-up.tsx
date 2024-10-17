import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { APPOINTMENTS } from '../constants/routes';
import { firebase } from '../firebase/firebase';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerScreenParams } from '../types/drawerScreenParams';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const auth = getAuth(firebase);

export default function SignUp({
  navigation
}: DrawerScreenProps<DrawerScreenParams, 'signUp'>) {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigation.navigate(APPOINTMENTS);
    }
  });

  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
