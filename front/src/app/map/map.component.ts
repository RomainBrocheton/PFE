import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-arrowheads';
import { SharingService } from '../_services/sharing.service';

const ZOOM_INIT = 14;
const ZOOM_IN = 12;
const ZOOM_MAX = 18;
const ZOOM_MIN = 3;

var tabIdArea: Array<string>,
tabArea: Array<L.Rectangle>,		tabAreaColor: Array<L.Rectangle>, 
tabLongitudeSW: Array<string>, tabLongitudeNE: Array<string>,
tabLatitudeSW: Array<string>, 	tabLatitudeNE: Array<string>;

var tabLongitudeRecSW: Array<string>, tabLatitudeRecSW: Array<string>, tabLongitudeRecSE: Array<string>, tabLatitudeRecSE: Array<string>, tabLongitudeRecNW: Array<string>, tabLatitudeRecNW: Array<string>, tabLongitudeRecNE: Array<string>, tabLatitudeRecNE: Array<string>, tabNumberRec, numberRec: string, latitudeRecSW, longitudeRecSW, latitudeRecNE, longitudeRecNE, numberRecColor;
var arrowTab: Array<L.Polyline>;

const mapAreaColor = [{name: "EMERGING", color: "#009900"}, 
                {name: "DECREASING", color: "#b32d00"}, 
                {name: "LATENT", color: "#0039e6"}, 
                {name: "LOST", color: "#ffff00"}, 
                {name: "JUMPING", color: "#3d3d29"}, 
                {name: "DEFAULT", color: "#f442e8"}];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() lat = 0;
  @Input() lon = 0;

  private map : any;

  constructor(private sharedService : SharingService) { }

  ngAfterViewInit(): void {
    this.initMap();

    this.sharedService.sharedMessage.subscribe((data) => {
      this.lat = data.lat;
      this.lon = data.lon;
      this.map.panTo(new L.LatLng(this.lat, this.lon));
      // this.map.flyTo(new L.LatLng(this.lat, this.lon));

      if(this.lat != 0 && this.lon != 0)
        this.map.setZoom(ZOOM_IN);

      //@ts-ignore
      if(data.grid && data.color)
      {
        this.clearMap();

        //@ts-ignore
        if( data.color[0].includes(":") ){
          //@ts-ignore
          this.areaTraitementSeq(data.grid, () =>{
            //@ts-ignore
            this.areaColorTraitementSeq(data.color, function(){
            });
          });
        }else{
          //@ts-ignore
          this.areaTraitement(data.grid, () =>{
            //@ts-ignore
            this.areaColorTraitement( data.color, function(){
            });
          });
        }
      };
    });
  }

  private initMap(){
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      zoom: ZOOM_INIT
    }).locate({
      setView: true,
      maxZoom: ZOOM_INIT
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: ZOOM_MAX,
      minZoom: ZOOM_MIN
    });

    tiles.addTo(this.map);
  }

  drawLine(centrelat: number, centrelong: number, calculatedLat: any, calculatedLong: any, couleur: any, 
    direction: string, descriptionColor: string, numberRecColor: string, tabLatitudeRecSW: any, tabLatitudeRecNE: any){
    
        // Crée un polyline coloré sur la map à partir d'un tableau de points LatLng
        var latlngs = [
            [new L.LatLng(centrelat, centrelong)],
            [new L.LatLng(calculatedLat, calculatedLong)]
        ];
    
        // Documentation du plugin permettant de mettre des flèches aux polyline
        // https://github.com/slutske22/leaflet-arrowheads
    
        var fleche = L.polyline(latlngs, {color: couleur, opacity: 0.8}).arrowheads({});
        fleche.addTo(this.map);
    
        // zoom the map to the polyline
        this.map.fitBounds(fleche.getBounds());
    
        arrowTab.push(fleche);
    
        fleche.bindPopup("Direction: " + direction + '<br>'
                        + "Type: " + descriptionColor + '<br>'
                        + "Cell id: " + numberRecColor + '<br>'
                        + "SW: " + tabLatitudeRecSW + "," + tabLongitudeRecSW + '<br>' 
                        + "NE: " + tabLatitudeRecNE + "," + tabLongitudeRecNE);
  }

  /* --------------------------- Remise à zéro de la map (= suppresion de l'ensemble des formes dessinées sur la map) --------------------------- */

  clearMap(){
    this.clearColor();
    this.clearRectangles();
    this.clearArrow();
  }

  clearRectangles() {
    if( tabArea ){
      for (var i = 0; i < tabArea.length; i++) {
        if( tabArea[i] ) tabArea[i].remove();
      }
    }
  }

  clearArrow(){
    if(arrowTab){
      for(var i = 0; i < arrowTab.length; i++){
        if( arrowTab[i] ) arrowTab[i].remove();
      }
    }
    arrowTab = [];
  }


  clearColor() {
    if( tabAreaColor ){
      for (var i = 0; i < tabAreaColor.length; i++) {
        if( tabAreaColor[i] ) tabAreaColor[i].remove();
      }
    }
  }

  /* --------------------------- READFILE() --------------------------- */
  // @ts-ignore
  readFile( file, _callback ) {
    // Si le fichier est ok
    if (file) {
      
      // On instancie un FileReader pour récupérer le contenu du fichier
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      // En cas de succès de lecture du fichier
      reader.onload = function ( fileRead ) {
        
        // On récupère le fichier ligne par ligne dans un tableau
        // @ts-ignore
        var lines = fileRead.target.result.split('\n');

        // On retourne un tableau contenant les lignes du fichier
        _callback( file.name, lines );
      }

      // En cas d'echec de lecture du fichier
      reader.onerror = function ( e ) {

          // MESSAGE ERREUR ?
          _callback( file.name, null );
      }
    }
  }

  /* --------------------------- TREATMENT --------------------------- */
  // Création des zones en fonction des informations données dans le tableau mis en argument
  // @ts-ignore
  areaTraitement( lines, _callback ) {

    // Tableau permettant de stocker les zones, permet de les supprimer de la carte si besoin
    tabIdArea = [];
    tabArea = [];

    tabLongitudeSW = [];
    tabLatitudeSW = [];
    tabLongitudeNE = [];
    tabLatitudeNE = [];

    // On effectue un parcours ligne par ligne
    for ( var i = 0 ; i < lines.length - 1 ; i++ ) {
      
      // On récupère le numéro de la zone
      let idArea = lines[i].substring( 0, lines[i].indexOf( "|" ) );
      tabIdArea[i] = idArea;
      
      var locations = lines[i].split('|');
      
      // --- South West ( SW ) ---
      // locations[1] est le South West ( SW )
      var coordonnees = locations[1].split(',');
      
      // Coordonnées du South West ( SW )
      let longitudeSW = coordonnees[0];
      let latitudeSW = coordonnees[1];

      // Ajout des coordonnées du SW dans les tableaux des coordonnées
      tabLongitudeSW[i] = longitudeSW;
      tabLatitudeSW[i] = latitudeSW;
      
      // --- North East ( NE ) ---
      // locations[4] est le North East ( NE )
      var coordonnees = locations[4].split(',');
      
      // Coordonnées du North East ( NE )
      let longitudeNE = coordonnees[0];
      let latitudeNE = coordonnees[1];

      // Ajout des coordonnées du NW dans les tableaux des coordonnées
      tabLongitudeNE[i] = longitudeNE;
      tabLatitudeNE[i] = latitudeNE;
      
      // On crée notre zone
      // let bounds = [ [new L.LatLng(latitudeNE, longitudeNE)], [new L.LatLng(latitudeSW, longitudeSW)] ];
      var bounds = [ [latitudeNE, longitudeNE], [latitudeSW, longitudeSW] ];
      // @ts-ignore
      var area = L.rectangle(bounds, {color:"#3d3d29", weight: 0.4, fillOpacity: 0.0}).addTo(this.map);
      
      area.bindPopup("Id : " + numberRec + '<br>'  
                  + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i] + '<br>' 
                  + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i]);
      
      tabArea[i] = area;
    }

    _callback();
  }

  // Même fonction mais avec personnalisation des couleurs des zones
  // @ts-ignore
  areaColorTraitement( lines, cb ) {

  // Tableau permettant de stocker les zones colorées, permet de les supprimer de la carte si besoin
  tabAreaColor = [];

  // On effectue un parcours ligne par ligne
  for ( var i = 0 ; i < lines.length  ; i++ ) {
      // console.log("areaColorTraitement : " + i);
      
      // On récupère le numéro de la zone
      let idColorArea = lines[i].substring( 0, lines[i].indexOf( " " ) );

      // On recupère le type de la zone
      let typeArea = lines[i].substring( lines[i].lastIndexOf( " " ) + 1 );

      // Si la zone est bien présente sur la carte
      if ( idColorArea == tabIdArea[i] ) {
          
          // On parcourt la map des couleurs à affecter en fonction du type de la zone
          for ( var indexMapAreaColor = 0 ; indexMapAreaColor < mapAreaColor.length ; indexMapAreaColor++ ) {
              
              // Affecte la bonne couleur en fonction de son nom, et applique la couleur par défaut si besoin
              if ( ( typeArea == mapAreaColor[ indexMapAreaColor ].name ) || ( indexMapAreaColor == mapAreaColor.length - 1 ) ) {
                  
                  // On crée la zone colorée en fonction de la couleur donnée par la map des couleurs à affecter en fonction du type de la zone
                  // @ts-ignore
                  var bounds = [ [parseFloat(tabLatitudeNE[i]), parseFloat(tabLongitudeNE[i])], [parseFloat(tabLatitudeSW[i]), parseFloat(tabLongitudeSW[i])] ];
                  // @ts-ignore
                  var areaColor = L.rectangle(bounds, {color: mapAreaColor[ indexMapAreaColor ].color, opacity: 0.0, weight: 0, fillOpacity: 0.8}).addTo(this.map);
                  
                  // On ajoute la zone colorée dans le tableau contenant toutes les zones colorées
                  tabAreaColor[i] = areaColor;

                  // On rend la zone colorée cliquable, quand celle-ci est cliquée des informations telles que son id, son type, et ses coordonnées spatiales sont affichées
                  areaColor.bindPopup("Id : " + idColorArea + '<br>'
                                  + "Type: " + mapAreaColor[ indexMapAreaColor ].name + '<br>' 
                                  + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i] + '<br>' 
                                  + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i]);
                  
                  // On a trouvé la couleur correspondant au type de cette zone, on peut passer à la zone suivante
                  break;
                } 
            }
        }
    }

    cb();
  }

  // @ts-ignore
  areaTraitementSeq(lines, _callback) {

    tabLongitudeRecSW = [];
    tabLatitudeRecSW = [];
    tabLongitudeRecNE = [];
    tabLatitudeRecNE = [];
    tabLongitudeRecSE = [];
    tabLatitudeRecSE = [];
    tabLongitudeRecNW = [];
    tabLatitudeRecNW = [];		

    tabNumberRec = [];

    tabArea = [];

    for (var i = 0; i < lines.length-1; i++) {
      //une ligne exemple :		//59|5.364476421678647,43.28555797340999|5.36521683023673,43.285018986705|5.364476415118365,43.285018986705|5.365216843357294,43.28555797340999|
        
      numberRec = lines[i].substring(0, lines[i].indexOf("|", 0));
      tabNumberRec[i] = numberRec;
        
      var points = lines[i].split('|');
        
      //point[1] est le SW
      var coordonnees = points[1].split(",");
      longitudeRecSW = coordonnees[0];
      latitudeRecSW = coordonnees[1];

      tabLongitudeRecSW[i] = longitudeRecSW;
      tabLatitudeRecSW[i] = latitudeRecSW;
        
      //point[2] est le SE
      var coordonnees = points[2].split(",");
      let longitudeRecSE = coordonnees[0];
      let latitudeRecSE = coordonnees[1];

      tabLongitudeRecSE[i] = longitudeRecSE;
      tabLatitudeRecSE[i] = latitudeRecSE;
        
      //point[3] est le NW
      var coordonnees = points[3].split(",");
      let longitudeRecNW = coordonnees[0];
      let latitudeRecNW = coordonnees[1];

      tabLongitudeRecNW[i] = longitudeRecNW;
      tabLatitudeRecNW[i] = latitudeRecNW;
        
      //point[4] est le NE
      coordonnees = points[4].split(",");
      longitudeRecNE = coordonnees[0];
      latitudeRecNE = coordonnees[1];

      tabLongitudeRecNE[i] = longitudeRecNE;
      tabLatitudeRecNE[i] = latitudeRecNE;
        
      var bounds = [ [latitudeRecNE, longitudeRecNE], [latitudeRecSW, longitudeRecSW] ];
      // @ts-ignore
      var rectangle = L.rectangle(bounds, {color:"#3d3d29", weight: 0.4, fillOpacity: 0.0}).addTo(map);
      this.map.fitBounds(bounds);

      tabArea[i] = rectangle;
    }

    _callback();	
  }

  // @ts-ignore
  areaColorTraitementSeq(lines, cb ){

    tabAreaColor = [];    

    for (var i = 0; i < lines.length-1; i++) {
    //exemple de ligne
    //201977 W:LATENT,DECREASING,EMERGING SW:DECREASING NW:DECREASING NE:EMERGING NONE:DECREASING

      var champs = lines[i].split(' ');
      numberRecColor = champs[0];

      for (var j = 1; j < champs.length; j++) {

        var dirtype = champs[j].split(':');
        var direction = dirtype[0];
        var descriptionColor = dirtype[1];

        var couleur;
        
        var index = mapAreaColor.findIndex(function(element) {
          return element.name == descriptionColor;
        });

        if(index != -1){
          couleur = mapAreaColor[index].color;
        }else{
          couleur = mapAreaColor[mapAreaColor.length-1].color;
        }
            
        // Selon la direction faire fleche (a partir du centre de la cellule concernee)
        // avec la couleur du type

        
        var centrelat = (parseFloat(tabLatitudeRecSW[i]) + parseFloat(tabLatitudeRecNE[i]) + parseFloat(tabLatitudeRecNW[i]) + parseFloat(tabLatitudeRecSE[i])) / 4;
        var centrelong = (parseFloat(tabLongitudeRecSW[i]) + parseFloat(tabLongitudeRecNE[i]) + parseFloat(tabLongitudeRecNW[i]) + parseFloat(tabLongitudeRecSE[i])) / 4;
            
        //direction : N S E W NE NW SW SE NONE
        if(direction == "N") {
          var nordlat = parseFloat(tabLatitudeRecNE[i]);
          var nordlong = (parseFloat(tabLongitudeRecNE[i]) + parseFloat(tabLongitudeRecNW[i])) / 2;

          this.drawLine(centrelat, centrelong, nordlat, nordlong, couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);
                
        } else if(direction == "S") {
          var sudlat = parseFloat(tabLatitudeRecSE[i]);
          var sudlong = (parseFloat(tabLongitudeRecSE[i]) + parseFloat(tabLongitudeRecSW[i])) / 2;

          this.drawLine(centrelat, centrelong, sudlat, sudlong, couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

        } else if(direction == "E") {
          var estlat = (parseFloat(tabLatitudeRecNE[i]) + parseFloat(tabLatitudeRecSE[i])) / 2;
          var estlong = parseFloat(tabLongitudeRecNE[i]);

          this.drawLine(centrelat, centrelong, estlat, estlong, couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

        } else if(direction == "NE") {
                
          this.drawLine(centrelat, centrelong, tabLatitudeRecNE[i], tabLongitudeRecNE[i], couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

        } else if(direction == "NW") {

          this.drawLine(centrelat, centrelong, tabLatitudeRecNW[i], tabLongitudeRecNW[i], couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);
        } else if(direction == "SW") {
                
          this.drawLine(centrelat, centrelong, tabLatitudeRecSW[i], tabLongitudeRecSW[i], couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

        } else if(direction == "SE") {

          this.drawLine(centrelat, centrelong, tabLatitudeRecSE[i], tabLongitudeRecSE[i], couleur, 
              direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

        } else { // on fait un rectangle
                
          // On parcourt la map des couleurs à affecter en fonction du type de la zone
          for ( var indexMapAreaColor = 0 ; indexMapAreaColor < mapAreaColor.length ; indexMapAreaColor++ ) {
                
            // Affecte la bonne couleur en fonction de son nom, et applique la couleur par défaut si besoin
            if ( ( descriptionColor == mapAreaColor[ indexMapAreaColor ].name ) || ( indexMapAreaColor == mapAreaColor.length - 1 ) ) {
                    
              var bounds = [ [parseFloat(tabLatitudeRecNE[i]), parseFloat(tabLongitudeRecNE[i])], [parseFloat(tabLatitudeRecSW[i]), parseFloat(tabLongitudeRecSW[i])] ];
              // @ts-ignore
              var rectangle1 = L.rectangle(bounds, {color: mapAreaColor[ indexMapAreaColor ].color, opacity: 0.0, weight: 0, fillOpacity: 0.5}).addTop(map);
              this.map.fitBounds(bounds);                        
                        
              tabAreaColor[i] = rectangle1;

              if(champs.length == 2) {

                rectangle1.bindPopup("Id: " + numberRecColor + '<br>'
                + "Type: " + descriptionColor + '<br>' 
                + "SW: " + tabLatitudeRecSW[i] + "," + tabLongitudeRecSW[i] + '<br>' 
                + "NE: " + tabLatitudeRecNE[i] + "," + tabLongitudeRecNE[i]);

              }

              break;
            }
          }
        }
      }
    }
    cb();
  }

}
