import { setHeaderText } from '../header/state/headerSlice';
import { useAppDispatch } from '../store/hooks';

export default function SignUp() {
  const dispatch = useAppDispatch();
  dispatch(setHeaderText('Sign Up'));
  return <></>;
}
