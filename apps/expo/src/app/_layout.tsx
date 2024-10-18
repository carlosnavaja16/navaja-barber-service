import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerHeaderProps
} from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StyleProp, ViewStyle } from 'react-native';
import { Provider } from 'react-redux';
import { DrawerContent } from '../components/drawerContent';
import { Header } from '../components/header';
import {
  APPOINTMENTS_ROUTE,
  APPOINTMENTS_TITLE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  LOGIN_TITLE,
  SIGN_UP_ROUTE,
  SIGN_UP_TITLE
} from '../constants/screens';
import { firebase } from '../firebase/firebase';
import { store } from '../store/store';
import { DrawerParams } from '../types/drawerParams';
import Appointments from './appointments';
import App from './index';
import Login from './login';
import SignUp from './signUp';

const auth = getAuth(firebase);
const Drawer = createDrawerNavigator<DrawerParams>();

export default function Layout() {
  const [user] = useAuthState(auth);
  const hide: StyleProp<ViewStyle> = { display: 'none' };
  const hideIfLoggedIn: StyleProp<ViewStyle> = user ? { display: 'none' } : {};
  const showIfLoggedIn: StyleProp<ViewStyle> = user ? {} : { display: 'none' };

  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Drawer.Navigator
        drawerContent={(props: DrawerContentComponentProps) => (
          <DrawerContent {...props} />
        )}
        screenOptions={{
          header: (props: DrawerHeaderProps) => <Header {...props} />
        }}
      >
        <Drawer.Screen
          name={HOME_ROUTE}
          component={App}
          options={{
            headerShown: false,
            drawerItemStyle: hide
          }}
        />
        <Drawer.Screen
          name={APPOINTMENTS_ROUTE}
          component={Appointments}
          options={{
            drawerLabel: APPOINTMENTS_TITLE,
            title: APPOINTMENTS_TITLE,
            drawerItemStyle: showIfLoggedIn
          }}
        />
        <Drawer.Screen
          name={LOGIN_ROUTE}
          component={Login}
          options={{
            drawerLabel: LOGIN_TITLE,
            title: LOGIN_TITLE,
            drawerItemStyle: hideIfLoggedIn
          }}
        />
        <Drawer.Screen
          name={SIGN_UP_ROUTE}
          component={SignUp}
          options={{
            drawerLabel: SIGN_UP_TITLE,
            title: SIGN_UP_TITLE,
            drawerItemStyle: hideIfLoggedIn
          }}
        />
      </Drawer.Navigator>
    </Provider>
  );
}
