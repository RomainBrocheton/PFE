import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
import { ReaderService } from '../_services/reader.service';

@Component({
  selector: 'app-insert-manu',
  templateUrl: './insert-manu.component.html',
  styleUrls: ['./insert-manu.component.scss']
})
export class InsertManuComponent implements OnInit {
  gridFile : File  = new File([], '');
  colorFile : File = new File([], '');

  constructor(private api : ApiService, private reader : ReaderService, private auth : AuthService) { }

  ngOnInit(): void {
  }

  insert(f: NgForm){
    let gridInfo = f.value;

    let flags = 0; // permet d'attendre que les deux subscribe soient resolved
    this.reader.read(this.gridFile).subscribe(res => {
      gridInfo.gridFileLines = res;
      flags++;
      if(flags == 2)
        this.completeInsert(gridInfo);
    });

    this.reader.read(this.colorFile).subscribe(res => {
      gridInfo.colorFileLines = res;
      flags++;

      if(flags == 2)
        this.completeInsert(gridInfo);
    });
  }

  completeInsert(gridInfo : any){
    console.log(gridInfo);
    this.api.post('insertFiles', {data: gridInfo, token: this.auth.getUser()}).subscribe(res => {
      console.log(res);
    });
  }

  /** 
   * Ces deux méthodes sont appellées lorsqu'un fichier est chargé
  */
  handleGridFile(event : any){
    this.gridFile = event.target.files[0];
  }

  handleColorFile(event : any){
    this.colorFile = event.target.files[0];
  }
}
