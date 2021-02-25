import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
// import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {
    // this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    if (Cookie.check('.PSC.Dormitory.Admin.Cookie'))
      this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.PSC.Dormitory.Admin.Cookie')));
  }

  public get currentUserValue(): any {
    return Cookie.check('.PSC.Dormitory.Admin.Cookie') ? this.currentUserDetails.value : null;
  }

  public isAuthenticated(): boolean {
    return Cookie.check('.PSC.Dormitory.Admin.Cookie');
  }


  login(param) {
    var data = "id=" + param.id + "&password=" + encodeURIComponent(param.password)  + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post<any>(environment.baseUrl + 'tutor/login-with-password', param)
      .pipe(map(data => {
        console.log(data)
      
        const user = {
          Id: data.data.id,
          Email: data.data.email,
          FirstName: data.data.name,
          Mobile_no_1: data.data.mobile_no_1,
          Mobile_no_2: data.data.mobile_no_2,
          Gender: data.data.gender,
          role:"Admin",
          Roles: data.Roles? JSON.parse(data.Roles) : [],
          UserType: data.UserType,
          access_token: data.access_token,
        }
        let expireDate = new Date(data[".expires"]);
        Cookie.set('.PSC.Dormitory.Admin.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
        this.currentUserDetails.next(user);
        return true;
      }),
        catchError(err => {
          console.log(err);
          return of(null);
        }));
  }




  logout(hostname) {   
    Cookie.delete('.PSC.Dormitory.Admin.Cookie', '/', hostname);
    this.currentUserDetails.next(null);     
}



  // login(url, param) {

  //   var data = "username=" + param.UserName + "&password=" + encodeURIComponent(param.Password) + "&usertype=Admin&grant_type=password";
  //   var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
  //   return this.http.post<any>(environment.baseUrl + '/token', data, { headers: reqHeader })
  //     .pipe(map(data => {
      
  //       const user = {
  //         Id: data.Id,
  //         Email: data.Email,
  //         FirstName: data.FirstName,
  //         LastName: data.LastName,
  //         UserName: data.UserName,
  //         access_token: data.access_token,
  //       }
  //       let expireDate = new Date(data[".expires"]);
  //       Cookie.set('.PSC.Dormitory.Admin.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
  //       this.currentUserDetails.next(user);
  //       return true;
  //     }),
  //       catchError(err => {
  //         console.log(err);
  //         return of(null);
  //       }));
  // }


  // logout() {

  //   return this.http.post<any>(environment.apiUrl + 'Account/Logout', null).pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }

  registerSystemAdmin(url, params) {
    return this.http.post<any>(environment.apiUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

}
