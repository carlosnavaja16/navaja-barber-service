import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Button } from './button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebase } from '../firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { View, StyleSheet, Text } from 'react-native';
import { NAVAJA_SLATE_500, PADDING_HORIZONTAL } from '../constants/styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { HOME } from '../constants/routes';

const auth = getAuth(firebase);

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const [user] = useAuthState(auth);
  const navigation = props.navigation;
  const logout = () => {
    signOut(auth).then(() => {
      navigation.navigate(HOME);
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      {user && (
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={50} color={NAVAJA_SLATE_500} />
          <Text>{user.email}</Text>
        </View>
      )}
      <DrawerItemList {...props} />
      {user && (
        <View style={styles.buttonContainer}>
          <Button text="Logout" onPress={logout} />
        </View>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING_HORIZONTAL
  }
});
