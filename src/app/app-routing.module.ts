import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasketComponent } from './components/basket/basket.component';
import { BoughtTripsComponent } from './components/bought-trips/bought-trips.component';
import { DetailedTripViewComponent } from './components/detailed-trip-view/detailed-trip-view.component';
import { EditTripComponent } from './components/edit-trip/edit-trip.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginWindowComponent } from './components/login-window/login-window.component';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterWindowComponent } from './components/register-window/register-window.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { TripsManagerComponent } from './components/trips-manager/trips-manager.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { LogGuard } from './guard/log.guard';
import { ModeratorGuard } from './guard/moderator.guard';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  {
    path: 'trips/:id',
    component: DetailedTripViewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'trips', component: MainContainerComponent },
  { path: 'add', component: TripFormComponent, canActivate: [ModeratorGuard] },
  { path: 'manager', component: TripsManagerComponent, canActivate: [ModeratorGuard] },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
  { path: 'owned', component: BoughtTripsComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:key',
    component: EditTripComponent,
    canActivate: [ModeratorGuard],
  },
  { path: 'login', component: LoginWindowComponent, canActivate: [LogGuard] },
  {
    path: 'register',
    component: RegisterWindowComponent,
    canActivate: [LogGuard],
  },
  { path: 'settings', component: SettingsComponent, canActivate: [AdminGuard] },
  {
    path: 'fb',
    component: HomePageComponent,
    resolve: {
      url: 'externalUrlRedirectResolver',
    },
    data: {
      externalUrl: 'http://www.facebook.com',
    },
  },
  {
    path: 'ig',
    component: HomePageComponent,
    resolve: {
      url: 'externalUrlRedirectResolver',
    },
    data: {
      externalUrl: 'http://www.instagram.com',
    },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
