import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { Header } from '../components/header';
import { store } from '../store/store';

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Drawer
        screenOptions={{
          header: (props: DrawerHeaderProps) => <Header {...props} />
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Drawer.Screen
          name="appointments"
          options={{
            drawerLabel: 'Appointments',
            title: 'Appointments'
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: 'Login',
            title: 'Login'
          }}
        />
        <Drawer.Screen
          name="sign-up"
          options={{
            drawerLabel: 'Sign up',
            title: 'Sign Up'
          }}
        />
      </Drawer>
    </Provider>
  );
}
