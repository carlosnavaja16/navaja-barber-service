import { BookingState } from './booking/state/booking.reducer';
import { UserState } from './user/state/user.reducer';

export interface AppState {
  booking: BookingState;
  user: UserState;
}
