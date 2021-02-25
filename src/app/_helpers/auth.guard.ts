import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { AuthorizationService } from './../_services/authorization.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authorizationService: AuthorizationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log(currentUser);
        if (this.authenticationService.isAuthenticated()) {
            if (!this.hasRequiredPermission(route.data['auth'])) {
                this.router.navigate(['']);
                return false;
            }

            // logged in so return true 
            return true;

        }

        // not logged in so redirect to login page with the return url

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

        //     if(currentUser.UserType == 'SystemAdmin'){
        //     this.router.navigate(['/system-admin/login'], { queryParams: { returnUrl: state.url } });
        // }else {
        //     this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
        // }
        return false;
    }

    protected hasRequiredPermission(permission: string): Promise<boolean> | boolean {
        if (!permission) return true;
        let permissions = permission? permission.split(',') : null;
        // If user’s permissions already retrieved from the API
        if (this.authenticationService.currentUserDetails.value && this.authenticationService.currentUserDetails.value.role) {
            return this.authorizationService.hasPermissions(permissions);
        } else {
            return false;
        }
    }
}