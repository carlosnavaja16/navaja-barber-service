import { getAuth } from 'firebase/auth';
import { View, Text, StyleSheet } from 'react-native';
import { firebase } from '../firebase/firebase';
import { HOME } from '../constants/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerScreenParams } from '../types/drawerScreenParams';

const auth = getAuth(firebase);

export default function Appointments({
  navigation
}: DrawerScreenProps<DrawerScreenParams, 'appointments'>) {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigation.navigate(HOME);
    }
  });

  if (!user) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <Text>Appointments</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
