import { DrawerScreenProps } from '@react-navigation/drawer';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StyleSheet, Text, View } from 'react-native';
import { APPOINTMENTS_TYPE, HOME_ROUTE } from '../constants/screens';
import { firebase } from '../firebase/firebase';
import { DrawerParams } from '../types/drawerParams';

const auth = getAuth(firebase);

export default function Appointments({
  navigation
}: DrawerScreenProps<DrawerParams, APPOINTMENTS_TYPE>) {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigation.navigate(HOME_ROUTE);
    }
  });

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Appointments</Text>
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
