import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ProfileComponent } from './user/pages/profile/profile.component';
import { SignUpComponent } from './user/pages/sign-up/sign-up.component';
import { LoginComponent } from './user/pages/login/login.component';
import { LogoutComponent } from './user/pages/logout/logout.component';
import { GalleryComponent } from './gallery/gallery.component';
import { BookingComponent } from './booking/pages/booking.component';
import { TimeSlotsComponent } from './booking/components/time-slots/time-slots.component';

import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  FunctionsModule,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { ServicePickerComponent } from './booking/components/service-picker/service-picker.component';
import { DurationPipe } from './booking/pipes/duration.pipe';
import { DatePickerComponent } from './booking/components/date-picker/date-picker.component';
import { ProfileFormComponent } from './user/components/profile-form/profile-form.component';
import { SignUpFormComponent } from './user/components/sign-up-form/sign-up-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServicesComponent,
    ProfileComponent,
    SignUpComponent,
    LoginComponent,
    LogoutComponent,
    GalleryComponent,
    BookingComponent,
    TimeSlotsComponent,
    ServicePickerComponent,
    DurationPipe,
    DatePickerComponent,
    ProfileFormComponent,
    SignUpFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FunctionsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
  ],
  providers: [MatSnackBar],
  bootstrap: [AppComponent],
})
export class AppModule {}
