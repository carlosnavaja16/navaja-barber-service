import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HeaderService } from './shared/services/header/header.service';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from './gallery/gallery.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { ToastService } from './shared/services/toast/toast.service';
import { BookingComponent } from './booking/booking.component';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';

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
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    NgbModule
  ],
  providers: [
    HeaderService,
    ToastService,
    { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['http://localhost', 9099] : undefined },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['http://localhost', 8080] : undefined },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['http://localhost', 5001] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
