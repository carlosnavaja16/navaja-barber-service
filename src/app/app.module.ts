import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { BookingComponent } from './booking/booking.component';


import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { provideAuth, connectAuthEmulator, getAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore, enableMultiTabIndexedDbPersistence } from '@angular/fire/firestore';
import { connectFunctionsEmulator, FunctionsModule, getFunctions, provideFunctions } from '@angular/fire/functions';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServicesComponent,
    ProfileComponent,
    SignupComponent,
    LoginComponent,
    LogoutComponent,
    GalleryComponent,
    ToastContainerComponent,
    BookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FunctionsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
          connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    FormsModule,
    NgbModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
