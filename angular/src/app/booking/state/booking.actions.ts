import { createAction, props } from '@ngrx/store';
import { Service } from '@shared/schema/service';

export const selectService = createAction('Select Service', props<Service>());
export const clearService = createAction('Clear Service');
