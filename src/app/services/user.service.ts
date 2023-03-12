import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Roles } from '../enums/roles';
import { BasketElement } from '../models/basketElement';
import { BoughtTrip } from '../models/boughtTrip';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { DbUsersService } from './db-services/db-users.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  Users: User[] = [];
  sessionUser?: User;
  fromDb: any[] = [];
  constructor(
    private dbUsers: DbUsersService,
    private authService: AuthService
  ) {
    this.dbUsers
      .getUsersFromDB()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        // console.log(data);
        this.fromDb = data;
        this.Users = this.fromDb;
      });
  }

  addUser(user: User) {
    this.Users.push(user);
  }

  getUsers() {
    if (this.Users.length == 0) {
      setTimeout(() => {
        return this.Users;
      }, 400);
    }
    return this.Users;
  }

  getUser(key: string): User | null {
    const result = this.Users.filter((user) => {
      return user.id == key;
    });
    console.log(result);
    if (result.length == 0) {
      return null;
    }
    return result[0];
  }

  getSessionUser(): User | null {
    let sessId: string;
    // this.authService.getUser().subscribe((user:User|undefined) => {
    //   if(user){
    //     this.sessionUser = user;
    //     console.log(user)
    //   }
    // });
    // if(this.sessionUser){
    //   sessId = this.sessionUser.id
    // }
    // else {
    //   return null;
    // }
    // console.log(this.sessionUser)
    if (this.authService.getUser()) {
      sessId = this.authService.getUser().uid;
    } else {
      return null;
    }
    const result = this.Users.filter((user) => {
      return user.id == sessId;
    });
    if (result.length == 0) {
      return null;
    }
    // console.log(result);
    this.sessionUser = result[0];
    return result[0];
  }

  userBoughtTrip(trip: BoughtTrip) {
    if (this.sessionUser) {
      if (!this.sessionUser.boughtTrips) {
        this.sessionUser.boughtTrips = [];
      }
      this.sessionUser.boughtTrips.push(trip);
      console.log(this.sessionUser.key);
      this.dbUsers.updateUserInDB(this.sessionUser.key!, this.sessionUser);
    }
  }

  userReservationChange(basketElementsList: BasketElement[]) {
    if (this.sessionUser) {
      this.sessionUser.basket = basketElementsList;
      console.log(this.sessionUser.key);
      this.dbUsers.updateUserInDB(this.sessionUser.key!, this.sessionUser);
    }
  }

  isAdmin(): boolean {
    if (!this.sessionUser) {
      return false;
    }
    return this.checkRole(Roles.ADMINISTRATOR);
  }

  isCustomer(): boolean {
    if (!this.sessionUser) {
      return false;
    }
    return this.checkRole(Roles.CUSTOMER);
  }

  isManager(): boolean {
    if (!this.sessionUser) {
      return false;
    }
    return this.checkRole(Roles.MODERATOR);
  }

  private checkRole(role: Roles): boolean {
    return this.sessionUser?.roles.indexOf(role) != -1;
  }
}
