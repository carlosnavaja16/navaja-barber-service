import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ProfileComponent } from './profile/pages/profile.component';
import { SignupComponent } from './user/pages/signup/signup.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './user/pages/login/login.component';
import { LogoutComponent } from './user/pages/logout/logout.component';
import { GalleryComponent } from './gallery/gallery.component';
import { BookingComponent } from './booking/pages/booking.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'services',
    component: ServicesComponent,
    data: { title: 'Services' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome },
  },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'gallery', component: GalleryComponent },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToHome },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
