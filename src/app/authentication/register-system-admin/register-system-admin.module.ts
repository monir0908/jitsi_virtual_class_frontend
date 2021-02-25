import {NgModule} from '@angular/core';
import {RegisterSystemAdminComponent} from './register-system-admin.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {RegisterSystemAdminRoutes} from './register-system-admin.routing';
import {SharedModule} from '../../shared/shared.module';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RegisterSystemAdminRoutes),
        SharedModule,
        BlockUIModule.forRoot(),
    ],
    declarations: [RegisterSystemAdminComponent]
})

export class RegisterSystemAdminModule {}
