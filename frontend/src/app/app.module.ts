import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './moduels/shared-modules/shared.module';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { DefaultLayoutComponent } from './moduels/default-layout';

import { LoginComponent } from './moduels/login/login.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './_loader/loader.component';
import { ProfileComponent } from './moduels/profile/profile.component';
import { UsersComponent } from './moduels/users/users.component';
import { UserManagementComponent } from './moduels/user-management/user-management.component';
import { CustomerManagementComponent } from './moduels/customer-management/customer-management.component';

import { UserViewComponent } from './moduels/components/user-view/user-view.component';
import { UserFormDialogComponent } from './moduels/components/user-form-dialog/user-form-dialog.component';
import { MultiSelectComponent } from './moduels/components/multi-select/multi-select.component';
import { RoleComponent } from './moduels/components/role/role.component';
import { RoleFormDialogComponent } from './moduels/components/role-form-dialog/role-form-dialog.component';
import { RoleViewDialogComponent } from './moduels/components/role-view-dialog/role-view-dialog.component';
import { CustomerViewDialogComponent } from './moduels/components/customer-view-dialog/customer-view-dialog.component';
import { CustomerFormDialogComponent } from './moduels/components/customer-form-dialog/customer-form-dialog.component';
import { AccountManagementComponent } from './moduels/account-management/account-management.component';
import { TransactionManagementComponent } from './moduels/transaction-management/transaction-management.component';
import { AccountViewDialogComponent } from './moduels/components/account-view-dialog/account-view-dialog.component';
import { AccountFormDialogComponent } from './moduels/components/account-form-dialog/account-form-dialog.component';
import { NumberDotDirective } from './moduels/components/directives/number-dot.directive';



@NgModule({
  declarations: [
    
    AppComponent,
    DefaultLayoutComponent,
    LoginComponent,
    LoaderComponent,
    ProfileComponent,
    UsersComponent,
    UserManagementComponent,
    CustomerManagementComponent,
    UserViewComponent,
    RoleComponent,
    UserFormDialogComponent,
    MultiSelectComponent,
    RoleFormDialogComponent,
    RoleViewDialogComponent,
    CustomerViewDialogComponent,
    CustomerFormDialogComponent,
    AccountManagementComponent,
    TransactionManagementComponent,
    AccountViewDialogComponent,
    AccountFormDialogComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    CommonModule



  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    authInterceptorProviders,
    provideAnimations(),
    provideToastr()

  ],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
