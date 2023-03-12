import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-window',
  templateUrl: './login-window.component.html',
  styleUrls: ['./login-window.component.css'],
})
export class LoginWindowComponent implements OnInit {
  currLogin: string = '';
  currPassword: string = '';
  wrongMail: boolean = false;
  wrongPassword: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.isLogged()) {
        this.router.navigateByUrl('/home');
      }
    }, 300);
  }

  onSubmit() {
    console.log(this.currLogin);
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
    this.authService.login(this.currLogin, this.currPassword);
  }
}
