import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
import { ReaderService } from '../_services/reader.service';

@Component({
  selector: 'app-insert-auto',
  templateUrl: './insert-auto.component.html',
  styleUrls: ['./insert-auto.component.scss']
})
export class InsertAutoComponent implements OnInit {
  gridFile : File  = new File([], '');
  colorFile : File = new File([], '');
  separator : string = '_';

  constructor(private api : ApiService, private reader : ReaderService, private auth : AuthService) { }

  ngOnInit(): void {
  }


  insert(f: NgForm){
    let gridInfo = this.getFileInfo(this.gridFile, this.separator);

    let flags = 0;
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
    this.api.post('insertFiles', {data: gridInfo, token: this.auth.getUser()}).subscribe(res => {
      console.log(res);
    });
  }

  getFileInfo(file : File, separator : string){
    const filename = file.name;
    let splitted = filename.split(separator);

    console.log(splitted[9]);
    if(separator == "" || splitted[9] == undefined){
      alert('Merci de respecter le format ou de modifier le séparateur utilisé.');
      return {gridFileLines: null, colorFileLines: null};
    }

    let result = {
      fileType: splitted[0],
      city: splitted[1],
      latitude: splitted[2],
      longitude: splitted[3],
      period: splitted[4],
      granularity: splitted[5],
      thresholdVehicule: splitted[6],
      timeDivisionStart: splitted[7],
      timeDivisionEnd: splitted[8],
      direction: splitted[9],
      gridFileLines: [0],
      colorFileLines: [0]
    }

    if(result.direction) result.direction = result.direction.split(".")[0];

    return result;
  }

  handleGridFile(event : any){
    this.gridFile = event.target.files[0];
  }

  handleColorFile(event : any){
    this.colorFile = event.target.files[0];
  }
}
