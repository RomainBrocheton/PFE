/**
 * Ce service permet de lire un fichier texte. 
 * La méthode read retourne une observable contenant les lignes du fichier sous forme d'array
 */
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  constructor() { }

  read(file : File){
    let reader: FileReader = new FileReader();

    return new Observable((observer : Observer<any>) => {
      reader.readAsBinaryString(file);
      reader.onload = event => {
        //@ts-ignore()
        observer.next(reader.result.split("\n"));
      }
      reader.onerror = (e) => {
        observer.error(e);
      }
    });
  }
}
