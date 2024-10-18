import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StyleSheet, Text, View } from 'react-native';
import { HOME_ROUTE } from '../constants/screens';
import { NAVAJA_SLATE_500, PADDING_HORIZONTAL } from '../constants/styles';
import { firebase } from '../firebase/firebase';
import { Button } from './button';

const auth = getAuth(firebase);

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const [user] = useAuthState(auth);
  const navigation = props.navigation;
  const logout = () => {
    signOut(auth).then(() => {
      navigation.navigate(HOME_ROUTE);
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
