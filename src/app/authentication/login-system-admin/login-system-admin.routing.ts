import {Routes} from '@angular/router';
import {LoginSystemAdminComponent} from './login-system-admin.component';

export const LoginSystemAdminRoutes: Routes = [
    {
        path: '',
        component: LoginSystemAdminComponent,
        data: {
            breadcrumb: 'Login'
        }
    }
];
