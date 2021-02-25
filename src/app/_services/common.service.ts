import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private http: HttpClient) { }

  get(url, obj?: any) {
    let params = new HttpParams();
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }

    return this.http.get<any>(environment.apiUrl + url, { params }).pipe(
      map(res => {
        return res;
      })
    );
  }

  post(url, params) {
    return this.http.post<any>(environment.apiUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

  put(url, params) {
    return this.http.put<any>(environment.apiUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

  postMultipart(url, params) {
    return this.http.post<any>(environment.apiUrl + url, params, {headers: {'Content-Type': undefined }}).pipe(
      map(res => {
        return res;
      })
    );
  }


  generateUrl(url: string = null): string {
    return environment.apiUrl + url;
  }


  downloadFile(url: string, obj?: any): any {
    let params = new HttpParams();

    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return this.http.get(environment.apiUrl + url, { responseType: 'blob', params })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }


  downloadMaterialFile(url: string): any {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }



  downloadCertificateFile(url: string, obj?: any) {
    let params = new HttpParams();

    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return this.http.get(environment.apiUrl + url, { responseType: 'blob', params })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }

}
