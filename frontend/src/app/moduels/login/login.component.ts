import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ToasterService } from '../../_services/toaster.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AuthService } from '../../_services/auth.service';
import { LoginRequestDto } from '../model/common-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../_loader/loader.service';
import { UserService } from '../../_services/user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;

  constructor(
    private router: Router,
    private toast: ToasterService,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    if (this.tokenStorage.getIsLoggedIn()) {
      this.router.navigate(['/']);
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }


    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;

    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toast.error("Login form invalid.");
      return;
    }

    const { username, password } = this.loginForm.value;

    let loginRequest: LoginRequestDto = {
      username: username,
      password: password
    };

    this.loaderService.show();
    this.authService.login(loginRequest).subscribe({
      next: data => {
        this.loaderService.hide();
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        if (data.accessToken) {
          this.tokenStorage.setIsLoggedIn(true);
          this.isLoggedIn = true;
          this.getUserInfo()
        }



      },
      error: err => {
        this.loaderService.hide();
        this.toast.error(err.error.message);
        this.tokenStorage.setIsLoggedIn(false);
      }
    });
  }

  getUserInfo() {
    this.loaderService.show();
    this.userService.fetchUserInfo().subscribe({
      next: res => {
        if (res) {
          this.loaderService.hide();
          this.toast.success("Loging has been successful.", "Welcome!")
          this.tokenStorage.saveUser(res);
          this.reloadPage();
        }
      }
    });

  }

  reloadPage(): void {
    window.location.reload();

  }

}
