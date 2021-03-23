import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthorizationService {

    permissions: Array<string>; // Store the actions for which this user has permission

    constructor(private authenticationService: AuthenticationService) {
        // if (this.authenticationService.currentUserDetails.value)
        //     this.permissions = this.authenticationService.currentUserDetails.value.role;
        // console.log(this.permissions);
    }

    hasPermission(role: string) {
        if (!role) return true;
        if (this.authenticationService.currentUserDetails.value && this.authenticationService.currentUserDetails.value.role === role) {
            return true;
        }
        return false;
    }

    hasPermissions(roles: Array<string>) {
        if (this.authenticationService.currentUserDetails.value) {
            let found = false;

            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (this.authenticationService.currentUserDetails.value.Roles.indexOf(role) !== -1) {
                    found = true;
                    break;
                }
            }
            return found;
        }
        return false;
    }
}