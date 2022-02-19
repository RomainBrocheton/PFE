import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  constructor(private auth : AuthService, private router : Router) { }

  ngOnInit(): void {
    if(this.auth.isLogged()){
      this.router.navigateByUrl('/visu'); // Page par défaut
    }
  }

  /**
   * Gére la connexion à l'application.
   */
  connexion(f : NgForm){
    this.auth.login(f.value).subscribe(res => {

      if(res.error){
        alert(res.error)
      }
      else{
        this.auth.setUser(res.token); // on stocke le token utilisateur
        location.href = '/';          // on redirige à la racine
      }
    });
  }

}
