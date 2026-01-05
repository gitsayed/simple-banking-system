import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ToasterService } from '../../_services/toaster.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AuthService } from '../../_services/auth.service';
import { LoginRequestDto, UserInfo } from '../model/common-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../_loader/loader.service';



@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: false
})
export class UserManagementComponent implements OnInit {

   pageIndicatorControl = new FormControl('user');

  test :any = "";
 
  constructor(
    private router: Router,
    private toast: ToasterService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private tokenStorage: TokenStorageService) { }


  ngOnInit(): void {

  
  }




}
