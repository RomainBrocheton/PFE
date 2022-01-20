import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  logged = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.logged = this.auth.isLogged();
  }

}
