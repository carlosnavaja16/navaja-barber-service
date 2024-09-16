import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { Header } from './common/components/header';
import { store } from './common/store/store';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Header />
      <Slot />
    </Provider>
  );
}
