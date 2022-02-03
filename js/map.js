var tabIdArea,
tabArea,		tabAreaColor, 
tabLongitudeSW, tabLongitudeNE,
tabLatitudeSW, 	tabLatitudeNE;

var tabRectangles, tabLongitudeRecSW, tabLatitudeRecSW, tabLongitudeRecSE, tabLatitudeRecSE, tabLongitudeRecNW, tabLatitudeRecNW, size, lines, rectangle, rectangle1, rectangle2, tabLongitudeRecNE, tabLatitudeRecNE, tabNumberRec, numberRec, latitudeRecSW, longitudeRecSW, latitudeRecNE, longitudeRecNE, map, numberRecColor, descriptionColor, date, number, hour, longitude, latitude, tabLongitude, tabLatitude, tabHour, tabNumber, tabDate, newLine, marker, color, newLineCoordinates, directionsService, directionsDisplay, tabMakers, fleche1, tabFleches;
var arrowTab = [];

var init = true;

var mapAreaColor = [{name: "EMERGING", color: "#009900"}, 
                {name: "DECREASING", color: "#b32d00"}, 
                {name: "LATENT", color: "#0039e6"}, 
                {name: "LOST", color: "#ffff00"}, 
                {name: "JUMPING", color: "#3d3d29"}, 
                {name: "DEFAULT", color: "#f442e8"}];

/* --------------------------- Initialisation de la map + choix des coordonnées géographiques initiales et du niveau de zoom --------------------------- */
// var map = L.map('map').setView([51.505, -0.09], 13);
var map = L.map('map').locate({setView: true, maxZoom: 13});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2FwdGFpbnZhbG91IiwiYSI6ImNreWp5ejV5NDF3aDcydXFwZ2VlaTBvcHkifQ.foC6qOxfH53hwcedPyjEoQ'
}).addTo(map);

/* --------------------------- INITMAP / DRAW ON MAP --------------------------- */

function initMap( longitudeInit, latitudeInit ) {

    if( !longitudeInit && !latitudeInit ){
        defaultZoom = 2;
        init = true;
    }else{
        if( init ) {
            init = false;
            defaultZoom = 14;
        }else{
            defaultZoom = map.getZoom();
        }
    }

    if ( !longitudeInit ) longitudeInit = 0;
    if ( !latitudeInit ) latitudeInit = 0;

    map.flyTo([parseFloat( latitudeInit ), parseFloat( longitudeInit )], defaultZoom);
}

// Une zone = Un carré de couleur
// Rend une zone cliquable => Quand on clique sur la zone, des informations telles que son id, son type, et ses coordonnées spatiales s'affichent
// function createAreaClickableInfo( elementToListen, content, map ) {
//     var contentString = content;
//     elementToListen.bindPopup(contentString);
// }

// function createClickablePoly(poly, html, map) {
//     var contentString = html;
//     poly.bindPopup(contentString);
// }

function drawLine(centrelat, centrelong, calculatedLat, calculatedLong, couleur, 
map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE){

    // Crée un polyline coloré sur la map à partir d'un tableau de points LatLng
    var latlngs = [
        [parseFloat(centrelat), parseFloat(centrelong)],
        [parseFloat(calculatedLat), parseFloat(calculatedLong)]
    ];

    // Documentation du plugin permettant de mettre des flèches aux polyline
    // https://github.com/slutske22/leaflet-arrowheads

    var fleche = L.polyline(latlngs, {color: couleur, opacity: 0.8}).arrowheads();
    fleche.addTo(map);

    // zoom the map to the polyline
    map.fitBounds(fleche.getBounds());

    arrowTab.push(fleche);

    fleche.bindPopup("Direction: " + direction + '<br>'
                    + "Type: " + descriptionColor + '<br>'
                    + "Cell id: " + numberRecColor + '<br>'
                    + "SW: " + tabLatitudeRecSW + "," + tabLongitudeRecSW + '<br>' 
                    + "NE: " + tabLatitudeRecNE + "," + tabLongitudeRecNE);

    // createAreaClickableInfo(fleche, 
    //         "Direction: " + direction + '<br>'
    //         + "Type: " + descriptionColor + '<br>'
    //         + "Cell id: " + numberRecColor + '<br>'
    //         + "SW: " + tabLatitudeRecSW + "," + tabLongitudeRecSW
    //         + '<br>' 
    //         + "NE: " + tabLatitudeRecNE + "," + tabLongitudeRecNE,
    //         map);
}

/* --------------------------- Remise à zéro de la map (= suppresion de l'ensemble des formes dessinées sur la map) --------------------------- */

function clearMap(){
    clearColor();
    clearRectangles();
    clearArrow();
}

function clearRectangles() {
    if( tabArea ){
        for (var i = 0; i < tabArea.length; i++) {
            if( tabArea[i] ) tabArea[i].remove();
        }
    }
}

function clearArrow(){
    if(arrowTab){
        for(var i = 0; i < arrowTab.length; i++){
            if( arrowTab[i] ) arrowTab[i].remove();
        }
    }
    arrowTab = [];
}


function clearColor() {
    if( tabAreaColor ){
        for (var i = 0; i < tabAreaColor.length; i++) {
            if( tabAreaColor[i] ) tabAreaColor[i].remove();
        }
    }
}

/* --------------------------- READFILE() --------------------------- */

function readFile( file, _callback ) {
    // Si le fichier est ok
    if (file) {

        // On instancie un FileReader pour récupérer le contenu du fichier
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        // En cas de succès de lecture du fichier
        reader.onload = function ( fileRead ) {

            // On récupère le fichier ligne par ligne dans un tableau
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
function areaTraitement( lines, _callback ) {

    // Tableau permettant de stocker les zones, permet de les supprimer de la carte si besoin
    tabIdArea = [];
    tabArea = [];

    tabLongitudeSW = [];
    tabLatitudeSW = [];
    tabLongitudeNE = [];
    tabLatitudeNE = [];

    // console.log(lines.length);

    // On effectue un parcours ligne par ligne
    for ( var i = 0 ; i < lines.length - 1 ; i++ ) {
        // console.log("areaTraitement : " + i);
        
        // On récupère le numéro de la zone
        idArea = lines[i].substring( 0, lines[i].indexOf( "|" ) );
        tabIdArea[i] = idArea;
        
        var locations = lines[i].split('|');
        
        // --- South West ( SW ) ---
        // locations[1] est le South West ( SW )
        var coordonnees = locations[1].split(',');
        
        // Coordonnées du South West ( SW )
        longitudeSW = coordonnees[0];
        latitudeSW = coordonnees[1];

        // Ajout des coordonnées du SW dans les tableaux des coordonnées
        tabLongitudeSW[i] = longitudeSW;
        tabLatitudeSW[i] = latitudeSW;
        
        // --- North East ( NE ) ---
        // locations[4] est le North East ( NE )
        var coordonnees = locations[4].split(',');
        
        // Coordonnées du North East ( NE )
        longitudeNE = coordonnees[0];
        latitudeNE = coordonnees[1];

        // Ajout des coordonnées du NW dans les tableaux des coordonnées
        tabLongitudeNE[i] = longitudeNE;
        tabLatitudeNE[i] = latitudeNE;
        
        // On crée notre zone
        var bounds = [ [latitudeNE, longitudeNE], [latitudeSW, longitudeSW] ];
        var area = L.rectangle(bounds, {color:"#3d3d29", weight: 0.4, fillOpacity: 0.0}).addTo(map);
        // map.fitBounds(bounds);
        
        area.bindPopup("Id : " + numberRec + '<br>'  
                    + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i] + '<br>' 
                    + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i]);

        // createClickablePoly(area, "Id : "
        //             + numberRec + '<br>'  
        //             + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i]
        //             + '<br>' 
        //             + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i],
        //             map);
        // On ajoute la zone dans le tableau contenant toutes les zones
        tabArea[i] = area;
    }

    _callback();
}

// Même fonction mais avec personnalisation des couleurs des zones
function areaColorTraitement( lines, cb ) {

    // Tableau permettant de stocker les zones colorées, permet de les supprimer de la carte si besoin
    tabAreaColor = [];

    // On effectue un parcours ligne par ligne
    for ( var i = 0 ; i < lines.length  ; i++ ) {
        // console.log("areaColorTraitement : " + i);
        
        // On récupère le numéro de la zone
        idColorArea = lines[i].substring( 0, lines[i].indexOf( " " ) );

        // On recupère le type de la zone
        typeArea = lines[i].substring( lines[i].lastIndexOf( " " ) + 1 );

        // Si la zone est bien présente sur la carte
        if ( idColorArea == tabIdArea[i] ) {
            
            // On parcourt la map des couleurs à affecter en fonction du type de la zone
            for ( var indexMapAreaColor = 0 ; indexMapAreaColor < mapAreaColor.length ; indexMapAreaColor++ ) {
                
                // Affecte la bonne couleur en fonction de son nom, et applique la couleur par défaut si besoin
                if ( ( typeArea == mapAreaColor[ indexMapAreaColor ].name ) || ( indexMapAreaColor == mapAreaColor.length - 1 ) ) {
                    
                    // On crée la zone colorée en fonction de la couleur donnée par la map des couleurs à affecter en fonction du type de la zone
                    var bounds = [ [parseFloat(tabLatitudeNE[i]), parseFloat(tabLongitudeNE[i])], [parseFloat(tabLatitudeSW[i]), parseFloat(tabLongitudeSW[i])] ];
                    var areaColor = L.rectangle(bounds, {color: mapAreaColor[ indexMapAreaColor ].color, opacity: 0.0, weight: 0, fillOpacity: 0.8}).addTo(map);
                    // map.fitBounds(bounds);
                    
                    // On ajoute la zone colorée dans le tableau contenant toutes les zones colorées
                    tabAreaColor[i] = areaColor;

                    // On rend la zone colorée cliquable, quand celle-ci est cliquée des informations telles que son id, son type, et ses coordonnées spatiales sont affichées
                    areaColor.bindPopup("Id : " + idColorArea + '<br>'
                                    + "Type: " + mapAreaColor[ indexMapAreaColor ].name + '<br>' 
                                    + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i] + '<br>' 
                                    + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i]);
                    
                    // createAreaClickableInfo(areaColor, "Id : "
                    //                 + idColorArea + '<br>' + "Type: "
                    //                     + mapAreaColor[ indexMapAreaColor ].name + '<br>' 
                    //                 + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i]
                    //                 + '<br>' 
                    //                 + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i],
                    //                     map);	

                    // On a trouvé la couleur correspondant au type de cette zone, on peut passer à la zone suivante
                    break;
                } 
            }
        }
    }

    cb();
}

function areaTraitementSeq(lines, _callback) {		

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
        longitudeRecSE = coordonnees[0];
        latitudeRecSE = coordonnees[1];

        tabLongitudeRecSE[i] = longitudeRecSE;
        tabLatitudeRecSE[i] = latitudeRecSE;
        
        //point[3] est le NW
        var coordonnees = points[3].split(",");
        longitudeRecNW = coordonnees[0];
        latitudeRecNW = coordonnees[1];

        tabLongitudeRecNW[i] = longitudeRecNW;
        tabLatitudeRecNW[i] = latitudeRecNW;
        
        //point[4] est le NE
        coordonnees = points[4].split(",");
        longitudeRecNE = coordonnees[0];
        latitudeRecNE = coordonnees[1];

        tabLongitudeRecNE[i] = longitudeRecNE;
        tabLatitudeRecNE[i] = latitudeRecNE;
        
        var bounds = [ [latitudeRecNE, longitudeRecNE], [latitudeRecSW, longitudeRecSW] ];
        var rectangle = L.rectangle(bounds, {color:"#3d3d29", weight: 0.4, fillOpacity: 0.0}).addTo(map);
        map.fitBounds(bounds);

        tabArea[i] = rectangle;

    }
    _callback();	
}

function areaColorTraitementSeq(lines, cb ){

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

                drawLine(centrelat, centrelong, nordlat, nordlong, couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);
                
            } else if(direction == "S") {
                var sudlat = parseFloat(tabLatitudeRecSE[i]);
                var sudlong = (parseFloat(tabLongitudeRecSE[i]) + parseFloat(tabLongitudeRecSW[i])) / 2;

                drawLine(centrelat, centrelong, sudlat, sudlong, couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

            } else if(direction == "E") {
                var estlat = (parseFloat(tabLatitudeRecNE[i]) + parseFloat(tabLatitudeRecSE[i])) / 2;
                var estlong = parseFloat(tabLongitudeRecNE[i]);

                drawLine(centrelat, centrelong, estlat, estlong, couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

            } else if(direction == "NE") {
                
                drawLine(centrelat, centrelong, tabLatitudeRecNE[i], tabLongitudeRecNE[i], couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

            } else if(direction == "NW") {

                drawLine(centrelat, centrelong, tabLatitudeRecNW[i], tabLongitudeRecNW[i], couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);
            } else if(direction == "SW") {
                
                drawLine(centrelat, centrelong, tabLatitudeRecSW[i], tabLongitudeRecSW[i], couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

            } else if(direction == "SE") {

                drawLine(centrelat, centrelong, tabLatitudeRecSE[i], tabLongitudeRecSE[i], couleur, 
                    map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

            } else { // on fait un rectangle
                
                // On parcourt la map des couleurs à affecter en fonction du type de la zone
                for ( var indexMapAreaColor = 0 ; indexMapAreaColor < mapAreaColor.length ; indexMapAreaColor++ ) {
                
                    // Affecte la bonne couleur en fonction de son nom, et applique la couleur par défaut si besoin
                    if ( ( descriptionColor == mapAreaColor[ indexMapAreaColor ].name ) || ( indexMapAreaColor == mapAreaColor.length - 1 ) ) {
                    
                        var bounds = [ [parseFloat(tabLatitudeRecNE[i]), parseFloat(tabLongitudeRecNE[i])], [parseFloat(tabLatitudeRecSW[i]), parseFloat(tabLongitudeRecSW[i])] ];
                        var rectangle1 = L.rectangle(bounds, {color: mapAreaColor[ indexMapAreaColor ].color, opacity: 0.0, weight: 0, fillOpacity: 0.5}).addTop(map);
                        map.fitBounds(bounds);                        
                        
                        tabAreaColor[i] = rectangle1;

                        if(champs.length == 2) {

                            rectangle1.bindPopup("Id: " + numberRecColor + '<br>'
                            + "Type: " + descriptionColor + '<br>' 
                            + "SW: " + tabLatitudeRecSW[i] + "," + tabLongitudeRecSW[i] + '<br>' 
                            + "NE: " + tabLatitudeRecNE[i] + "," + tabLongitudeRecNE[i]);

                            // createAreaClickableInfo(rectangle1, "Id: "
                            //         + numberRecColor + '<br>' + "Type: "
                            //         + descriptionColor + '<br>' 
                            //         + "SW: " + tabLatitudeRecSW[i] + "," + tabLongitudeRecSW[i]
                            //         + '<br>' 
                            //         + "NE: " + tabLatitudeRecNE[i] + "," + tabLongitudeRecNE[i],
                            //         map);
                        }

                        break;
                    }
                }
            }
        }
    }
    cb();
}