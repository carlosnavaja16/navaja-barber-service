import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { Header } from '../components/header';
import { store } from '../store/store';
import { DrawerContent } from '../components/drawerContent';
import { getAuth } from 'firebase/auth';
import { firebase } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StyleProp, ViewStyle } from 'react-native';

const auth = getAuth(firebase);

export default function Layout() {
  const [user] = useAuthState(auth);

  const hide: StyleProp<ViewStyle> = { display: 'none' };
  const hideIfLoggedIn: StyleProp<ViewStyle> = user ? { display: 'none' } : {};
  const showIfLoggedIn: StyleProp<ViewStyle> = user ? {} : { display: 'none' };

  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          header: (props: DrawerHeaderProps) => <Header {...props} />
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false,
            drawerItemStyle: hide
          }}
        />
        <Drawer.Screen
          name="appointments"
          options={{
            drawerLabel: 'Appointments',
            title: 'Appointments',
            drawerItemStyle: showIfLoggedIn
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: 'Login',
            title: 'Login',
            drawerItemStyle: hideIfLoggedIn
          }}
        />
        <Drawer.Screen
          name="signUp"
          options={{
            drawerLabel: 'Sign up',
            title: 'Sign Up',
            drawerItemStyle: hideIfLoggedIn
          }}
        />
      </Drawer>
    </Provider>
  );
}
