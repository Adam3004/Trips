import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
// import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { DbUsersService } from './db-services/db-users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // userData: Observable<firebase.User>;
  userData$: any | null = null;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private dbUsers: DbUsersService
  ) {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        // this.userData = user;
        this.userData$ = user;
        console.log(this.userData$.uid);
        localStorage.setItem('user', JSON.stringify(this.userData$));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        console.log('null');
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // getUser(): Observable<User | undefined> {
  //   return new Observable((oberver) => {oberver.next(this.userData$)});
  // }
  getUser(){
    return this.userData$;
  }

  register(email: string, password: string) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.dbUsers.createUserInDB(new User(result.user!.uid, email));
        // window.alert(`User ${result.user} registered`);
        // this.userService.addUser(newUser);
        // this.dbUsers.createUserInDB(new User(this.result.user.uid, this.email);
        this.router.navigate(['home']);
      })
      .catch((error) => {
        window.alert('Something went wrong, try again');
        console.log(error)
      });
  }

  login(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.angularFireAuth.authState.subscribe((user) => {
          if (user) {
            window.alert(`User ${result.user?.email} logged`);
            this.router.navigate(['home']);
          }
        });
      })
      .catch((error) => {
        window.alert('Wrong login or password');
        console.log(error)
      });
  }

  logout() {
    return this.angularFireAuth.signOut().then(() => {
      this.router.navigate(['home']);
      window.location.reload();
    });
  }

  isLogged() {
    if (this.userData$ === null) {
      return false;
    }
    return true;
  }
}
