import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Roles } from '../enums/roles';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ModeratorGuard implements CanActivate {
  constructor(public userService: UserService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let tmpUser: User | null = this.userService.getSessionUser();
    if (
      tmpUser === null ||
      (tmpUser.roles.indexOf(Roles.ADMINISTRATOR) == -1 &&
        tmpUser.roles.indexOf(Roles.MODERATOR) == -1)
    ) {
      this.router.navigate(['home']);
    }
    return true;
  }
}
