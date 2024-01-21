import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from '@booking/pages/services/services.component';
import { ProfileComponent } from '@user/pages/profile/profile.component';
import { SignUpComponent } from '@user/pages/sign-up/sign-up.component';
import { LoginComponent } from '@user/pages/login/login.component';
import { LogoutComponent } from '@user/pages/logout/logout.component';
import { GalleryComponent } from './gallery/gallery.component';
import { BookingComponent } from '@booking/pages/booking/booking.component';
import { TimeSlotsComponent } from '@booking/components/time-slots/time-slots.component';
import { AppointmentSummaryComponent } from '@src/app/booking/components/appointment-summary/appointment-summary.component';
import { AppointmentPreviewComponent } from '@booking/components/appointment-preview/appointment-preview.component';
import { environment } from '@src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  FunctionsModule,
  connectFunctionsEmulator,
  getFunctions,
  provideFunctions
} from '@angular/fire/functions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicePickerComponent } from '@booking/components/service-picker/service-picker.component';
import { DurationPipe } from '@booking/pipes/duration.pipe';
import { DatePickerComponent } from '@booking/components/date-picker/date-picker.component';
import { ProfileFormComponent } from '@user/components/profile-form/profile-form.component';
import { SignUpFormComponent } from '@user/components/sign-up-form/sign-up-form.component';
import { AppointmentsComponent } from '@booking/pages/appointments/appointments.component';

// material design
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

// icons
import { NgIconsModule } from '@ng-icons/core';
import { heroBars3 } from '@ng-icons/heroicons/outline';
import { heroUserCircle } from '@ng-icons/heroicons/outline';
import { bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import { heroEnvelopeSolid } from '@ng-icons/heroicons/solid';
import { heroPhoneSolid, heroCalendarSolid } from '@ng-icons/heroicons/solid';
import { heroCalendarDays, heroCalendar } from '@ng-icons/heroicons/outline';
import {
  heroHomeModernMini,
  heroCalendarMini,
  heroClockMini
} from '@ng-icons/heroicons/mini';

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
    AppointmentPreviewComponent,
    AppointmentSummaryComponent,
    AppointmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FunctionsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({
      heroBars3,
      heroUserCircle,
      bootstrapGithub,
      bootstrapLinkedin,
      heroEnvelopeSolid,
      heroPhoneSolid,
      heroCalendarDays,
      heroCalendarSolid,
      heroCalendar,
      heroHomeModernMini,
      heroCalendarMini,
      heroClockMini
    }),
    MatSidenavModule
  ],
  providers: [MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule {}
