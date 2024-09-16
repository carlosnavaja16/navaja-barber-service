import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentRescheduleComponent } from './booking/pages/appointment-reschedule/appointment-reschedule.component';
import { AppointmentsComponent } from './booking/pages/appointments/appointments.component';
import { BookingComponent } from './booking/pages/booking/booking.component';
import { ServicesComponent } from './booking/pages/services/services.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/pages/login/login.component';
import { LogoutComponent } from './user/pages/logout/logout.component';
import { ProfileComponent } from './user/pages/profile/profile.component';
import { SignUpComponent } from './user/pages/sign-up/sign-up.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'services',
    component: ServicesComponent,
    data: { title: 'Services' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'gallery', component: GalleryComponent },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  },
  {
    path: 'appointments',
    component: AppointmentsComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  },
  {
    path: 'reschedule/:id',
    component: AppointmentRescheduleComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome }
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
