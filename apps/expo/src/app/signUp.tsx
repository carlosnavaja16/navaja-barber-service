import { DrawerScreenProps } from '@react-navigation/drawer';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StyleSheet, Text, View } from 'react-native';
import { APPOINTMENTS_ROUTE, SIGN_UP_TYPE } from '../constants/screens';
import { firebase } from '../firebase/firebase';
import { DrawerParams } from '../types/drawerParams';

const auth = getAuth(firebase);

export default function SignUp({
  navigation
}: DrawerScreenProps<DrawerParams, SIGN_UP_TYPE>) {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigation.navigate(APPOINTMENTS_ROUTE);
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
