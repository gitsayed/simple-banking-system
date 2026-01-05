

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';











@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private tokenStorageService: TokenStorageService
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if the user is logged in and has the required role
    const isLoggedIn = this.tokenStorageService.getIsLoggedIn();
    const roles : string[] = route.data['roles'] ;

    if (isLoggedIn) {
 
      // Check if the user has the required role
      // if (roles && roles.length > 0) {
      //   // Implement your role check logic here
      //   // const userRoles :string[] = this.tokenStorageService.getUser().roles;
      //   // const hasRequiredRole = userRoles.some(role => roles.includes(role));

      //   // if (!hasRequiredRole) {
          
      //   //   this.router.navigate(['/invalid-access']);
      //   //   return false;
      //   // }
      //   return true;
      // }
      return true;
    
    } else {
    
      this.router.navigate(['/login']);
      return false;
    }
  }
}
