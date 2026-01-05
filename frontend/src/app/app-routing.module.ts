import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './moduels/login/login.component';
import { AuthGuard } from './_authGuard/auth.guard';
import { DefaultLayoutComponent } from './moduels/default-layout';
import { ProfileComponent } from './moduels/profile/profile.component';
import { UserManagementComponent } from './moduels/user-management/user-management.component';
import { CustomerManagementComponent } from './moduels/customer-management/customer-management.component';
import { AccountManagementComponent } from './moduels/account-management/account-management.component';
import { TransactionManagementComponent } from './moduels/transaction-management/transaction-management.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customers',
        component: CustomerManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accounts',
        component: AccountManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactions',
        component: TransactionManagementComponent,
        canActivate: [AuthGuard],
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
