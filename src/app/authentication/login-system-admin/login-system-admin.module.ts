import {NgModule} from '@angular/core';
import {LoginSystemAdminComponent} from './login-system-admin.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LoginSystemAdminRoutes} from './login-system-admin.routing';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LoginSystemAdminRoutes),
        SharedModule
    ],
    declarations: [LoginSystemAdminComponent]
})

export class LoginSystemAdminModule {}
