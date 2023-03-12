import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class DbUsersService {
  private dbPath = '/users';
  usersRef: AngularFireList<User>;
  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list(this.dbPath);
  }

  createUserInDB(user: User): void {
    console.log('działa:', user);
    this.usersRef.push(user);
  }

  updateUserInDB(key: string, value: any) {
    return this.usersRef.update(key, value);
  }

  // deleteUserFromDB(key: string): Promise<void> {
  //   console.log(key);
  //   return this.usersRef.remove(key);
  // }

  getUsersFromDB(): AngularFireList<User> {
    return this.usersRef;
  }

  // deleteAllUsersFromDB() {
  //   this.usersRef.remove();
  // }
}
