import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  constructor(private auth : AuthService, private router : Router) { }

  ngOnInit(): void {
  }

  inscription(f : NgForm){
    this.auth.register(f.value).subscribe(res => {
      if(res.error){
        alert(res.error)
      }
      else{
        this.router.navigateByUrl('/connexion');
      }
    });
  }

}
