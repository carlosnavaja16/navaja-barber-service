import { useEffect } from 'react';
import { setHeaderText } from '../common/store/header/headerSlice';
import { useAppDispatch } from '../common/store/hooks';
import { firebase } from '../common/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { APPOINTMENTS } from '../common/routes';
import { Redirect } from 'expo-router';

const auth = getAuth(firebase);

export default function SignUp() {
  /**
   * Set the header text, must be in an effect to avoid rendering
   * a parent component (Header) while rendering this one.
   */
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHeaderText('Sign Up'));
  });

  const [user] = useAuthState(auth);
  if (user) {
    return <Redirect href={APPOINTMENTS} />;
  }

  return <></>;
}
