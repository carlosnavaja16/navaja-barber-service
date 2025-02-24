import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AppointmentRescheduleComponent } from "@booking/pages/appointment-reschedule/appointment-reschedule.component";
import { AppointmentsComponent } from "@booking/pages/appointments/appointments.component";
import { BookingComponent } from "@booking/pages/booking/booking.component";
import { ServicesComponent } from "@booking/pages/services/services.component";
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from "@user/pages/login/login.component";
import { LogoutComponent } from "@user/pages/logout/logout.component";
import { ProfileComponent } from "@user/pages/profile/profile.component";
import { SignUpComponent } from "@user/pages/sign-up/sign-up.component";
import { Routes } from '@angular/router';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['']);

export const HOME = '';
export const SERVICES = 'services';
export const PROFILE = 'profile';
export const SIGNUP = 'sign-up';
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const GALLERY = 'gallery';
export const BOOKING = 'booking';
export const APPOINTMENTS = 'appointments';
export const RESCHEDULE = 'reschedule/:id';

export const routes: Routes = [
  { path: HOME, component: HomeComponent },
  {
    path: SERVICES,
    component: ServicesComponent,
  },
  {
    path: PROFILE,
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  },
  { path: SIGNUP, component: SignUpComponent },
  { path: LOGIN, component: LoginComponent },
  { path: LOGOUT, component: LogoutComponent },
  { path: GALLERY, component: GalleryComponent },
  {
    path: BOOKING,
    component: BookingComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  },
  {
    path: APPOINTMENTS,
    component: AppointmentsComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  },
  {
    path: RESCHEDULE,
    component: AppointmentRescheduleComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  }
];