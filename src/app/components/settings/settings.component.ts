import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Roles } from 'src/app/enums/roles';
import { User } from 'src/app/models/user';
import { DbUsersService } from 'src/app/services/db-services/db-users.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  options: string[] = ['local', 'session', 'none'];
  constructor(
    private readonly afAuth: AngularFireAuth,
    public userService: UserService,
    private dbUsers: DbUsersService
  ) {}

  change(option: string) {
    this.afAuth
      .setPersistence(option)
      .then(() => {})
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  formatRolesIntoString(roles: Roles[]) {
    let output: string = '';
    if (roles.indexOf(Roles.CUSTOMER) != -1) {
      output += 'customer';
    }
    if (roles.indexOf(Roles.MODERATOR) != -1) {
      if (output.length > 0) {
        output += ', manager';
      } else {
        output += 'manager';
      }
    }
    if (roles.indexOf(Roles.ADMINISTRATOR) != -1) {
      if (output.length > 0) {
        output += ', administrator';
      } else {
        output += 'administrator';
      }
    }
    return output;
  }

  addOrRemoveText(roleNumber: number, roles: Roles[]) {
    if (roles.includes(roleNumber)) {
      return 'Remove ';
    }
    return 'Add ';
  }

  haveRole(roleNumber: number, roles: Roles[]) {
    if (roles.includes(roleNumber)) {
      return true;
    }
    return false;
  }

  addOrRemoveRoleOperation(user: User, numberOfRole: number) {
    if (user.roles.includes(numberOfRole)) {
      user.roles.splice(user.roles.indexOf(numberOfRole), 1);
    } else {
      user.roles.push(numberOfRole);
    }
    this.dbUsers.updateUserInDB(user.key!, user);
  }

  banOrUnbanUser(user: User) {
    user.isBlocked = !user.isBlocked;
    this.dbUsers.updateUserInDB(user.key!, user);
  }
}
