import { createReducer, on } from '@ngrx/store';
import { Service } from '@navaja/shared';
import { selectService } from './booking.actions';

export interface BookingState {
  selectedService: Service | null;
}

export const initialState: BookingState = {
  selectedService: null
};

export const bookingReducer = createReducer(
  initialState,
  on(selectService, (state, service) => {
    return {
      ...state,
      selectedService: service
    };
  })
);
