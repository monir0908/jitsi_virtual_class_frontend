import {Routes} from '@angular/router';
import {RegisterSystemAdminComponent} from './register-system-admin.component';

export const RegisterSystemAdminRoutes: Routes = [
    {
        path: '',
        component: RegisterSystemAdminComponent,
        data: {
            breadcrumb: 'Register'
        }
    }
];
