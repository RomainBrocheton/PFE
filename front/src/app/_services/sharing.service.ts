/**
 * Ce service permet de partager des observables entre composants.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private message = new BehaviorSubject({lat: 0, lon: 0});
  sharedMessage = this.message.asObservable();

  constructor() { }

  nextMessage(data : any){
    this.message.next(data);
  }
}
