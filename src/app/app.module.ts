import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { BreadcrumbsComponent } from './layouts/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layouts/admin/title/title.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmService } from './_helpers/confirm-dialog/confirm.service';
import { ConfirmComponent } from './_helpers/confirm-dialog/confirm.component';

import { AuthorizationService } from './_services/authorization.service';
import { AuthorizeDirective } from './_services/authorize.directive';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    BreadcrumbsComponent,
    TitleComponent,
    ConfirmComponent,
    AuthorizeDirective
  ],
  entryComponents: [ConfirmComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ConfirmService,
    AuthorizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
