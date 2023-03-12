import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { TripWindowComponent } from './components/trip-window/trip-window.component';
import { ChangeCurrencyPipe } from './pipes/change-currency.pipe';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { FilterTripsComponent } from './components/filter-trips/filter-trips.component';
import { IsFiltratedPipe } from './pipes/is-filtrated.pipe';
import { BasketComponent } from './components/basket/basket.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SafePipe } from './pipes/safe.pipe';
import { BoughtTripsComponent } from './components/bought-trips/bought-trips.component';
import { DetailedTripViewComponent } from './components/detailed-trip-view/detailed-trip-view.component';
import { OpinionFormComponent } from './components/opinion-form/opinion-form.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { environment } from '../environments/environment';
import { EditTripComponent } from './components/edit-trip/edit-trip.component';
import { LoginWindowComponent } from './components/login-window/login-window.component';
import { RegisterWindowComponent } from './components/register-window/register-window.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TripsManagerComponent } from './components/trips-manager/trips-manager.component';


@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    TripWindowComponent,
    ChangeCurrencyPipe,
    TripFormComponent,
    FilterTripsComponent,
    IsFiltratedPipe,
    BasketComponent,
    PageNotFoundComponent,
    HeaderMenuComponent,
    HomePageComponent,
    SafePipe,
    BoughtTripsComponent,
    DetailedTripViewComponent,
    OpinionFormComponent,
    EditTripComponent,
    LoginWindowComponent,
    RegisterWindowComponent,
    SettingsComponent,
    TripsManagerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        window.location.href = (route.data as any).externalUrl;
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
