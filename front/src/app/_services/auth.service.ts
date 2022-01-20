import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user : any = null;

  constructor(private http: HttpClient) { }

  login(credentials : any) : Observable<any>{
    return this.http.post(API_URL + 'login', credentials);
  }

  register(credentials : any) : Observable<any>{
    return this.http.post(API_URL + 'register', credentials);
  }

  getUser() : any{
    return this.user;
  }

  setUser(user : any) : void{
    this.user = user;
  }

  isLogged() : boolean{
    return (this.user !== null);
  }
}

// export interface Credentials {
//   email: string,
//   password: string
// }
