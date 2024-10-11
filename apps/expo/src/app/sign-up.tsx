import { Redirect } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { APPOINTMENTS } from '../constants/routes';
import { firebase } from '../firebase/firebase';

const auth = getAuth(firebase);

export default function SignUp() {
  const [user] = useAuthState(auth);
  if (user) {
    return <Redirect href={APPOINTMENTS} />;
  }

  return <></>;
}
