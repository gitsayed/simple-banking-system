import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ToasterService } from '../../_services/toaster.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AuthService } from '../../_services/auth.service';
import { LoginRequestDto, UserInfo } from '../model/common-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../_loader/loader.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  loginForm!: FormGroup;
  isLoggedIn = false;
  profile?: UserInfo;
 
  constructor(
    private router: Router,
    private toast: ToasterService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private tokenStorage: TokenStorageService) { }


  ngOnInit(): void {
    this.profile = this.tokenStorage.getUser() as UserInfo;
  
  }




}
