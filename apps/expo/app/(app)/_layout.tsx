import { Slot } from 'expo-router';
import { Header } from './header/components/header';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Header />
        <Slot />
      </Provider>
    </QueryClientProvider>
  );
}
