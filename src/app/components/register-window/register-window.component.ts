import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DbUsersService } from 'src/app/services/db-services/db-users.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-window',
  templateUrl: './register-window.component.html',
  styleUrls: ['./register-window.component.css'],
})
export class RegisterWindowComponent implements OnInit {
  currLogin: string = '';
  currPassword: string = '';
  wrongMail: boolean = false;
  wrongPassword: boolean = false;
  response: any;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dbUsers: DbUsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.isLogged()) {
        this.router.navigateByUrl('/home');
      }
    }, 300);
  }

  onSubmit() {
    let sthWrong = false;
    if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.currLogin)) {
      this.wrongMail = true;
      sthWrong = true;
    }
    if (this.currPassword.length < 6) {
      this.wrongPassword = true;
      sthWrong = true;
    }
    if (sthWrong) {
      return;
    }
    this.wrongMail = false;
    this.wrongPassword = false;
    this.authService
      .register(this.currLogin, this.currPassword)
      .then((output) => {
        setTimeout(() => {
          this.response = output;
          console.log(this.response);
          if (this.response) {
            console.log('działa');
            const newUser = new User(this.response, this.currLogin);
            // this.userService.addUser(newUser);
            this.dbUsers.createUserInDB(newUser);
          }
        }, 400);
      });
  }
}
