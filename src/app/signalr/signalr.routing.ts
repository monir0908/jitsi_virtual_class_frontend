import { Routes } from '@angular/router';

import { SignalRComponent } from './signalr.component';

export const SignalrRoutes: Routes = [{
  path: '',
  component: SignalRComponent,
  data: {
    breadcrumb: 'signalr',
    icon: 'icofont-signalr bg-c-blue',
    status: false
  }
}];
