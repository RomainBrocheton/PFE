import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export const API_URL = environment.apiUrl + '/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(endpoint : string) : Observable<any>{
    return this.http.get(API_URL + endpoint);
  }

  post(endpoint : string, data : any) : Observable<any>{
    return this.http.post(API_URL + endpoint, data);
  }

  put(endpoint : string, data : any) : Observable<any>{
    return this.http.put(API_URL + endpoint, data);
  }

  patch(endpoint : string, data : any) : Observable<any>{
    return this.http.patch(API_URL + endpoint, data);
  }

  delete(endpoint : string) : Observable<any>{
    return this.http.delete(API_URL + endpoint);
  }
}
