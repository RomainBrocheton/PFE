/**
 * auth.service.ts
 * Ce service permet de gérer l'authentification sur notre application.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.service';

const LS_KEY = 'logged';
const TTL_KEY = 'expiry';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user : any = null;

  constructor(private http: HttpClient) { }

  login(credentials : Credentials) : Observable<any>{
    return this.http.post(API_URL + 'login', credentials);
  }

  register(credentials : Credentials) : Observable<any>{
    return this.http.post(API_URL + 'register', credentials);
  }

  getUser() : any{
    return localStorage.getItem(LS_KEY) || false; 
  }

  setUser(user : any) : void{
    localStorage.setItem(LS_KEY, user);
  }

  logout(){
    localStorage.removeItem(LS_KEY);
  }

  isLogged() : boolean{
    return this.getUser() != false;
  }
}

export interface Credentials {
  email: string,
  password: string
}
