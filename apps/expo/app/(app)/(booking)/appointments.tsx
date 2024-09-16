import { useEffect } from 'react';
import { setHeaderText } from '../common/store/header/headerSlice';
import { useAppDispatch } from '../common/store/hooks';

export default function Appointments() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHeaderText('Appointments'));
  });

  return <></>;
}
