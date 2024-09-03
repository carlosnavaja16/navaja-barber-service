import { createAction, props } from '@ngrx/store';
import { Service } from '@navaja/shared';

export const selectService = createAction('Select Service', props<Service>());
export const clearService = createAction('Clear Service');
