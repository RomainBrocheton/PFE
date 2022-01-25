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
        
		map = new google.maps.Map( document.getElementById('map') , {
			zoom : defaultZoom,
			center : {		
				lng : parseFloat( longitudeInit ),
				lat : parseFloat( latitudeInit )
			},
		});
	}

	function createAreaClickableInfo( elementToListen, content, map ) {
		var contentString = content;
		var infoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(elementToListen, 'click', function(event) {
			infoWindow.setContent(contentString);
			infoWindow.setPosition(event.latLng);
			infoWindow.open(map);
		});
	}

	function createClickablePoly(poly, html, map) {
		var contentString = html;
		var infoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(poly, 'click', function(event) {
			infoWindow.setContent(contentString);
			infoWindow.setPosition(event.latLng);
			infoWindow.open(map);
		});
	}

	function drawLine(centrelat, centrelong, calculatedLat, calculatedLong, lineSymbol, couleur, 
		map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE){
		
		fleche = new google.maps.Polyline({
			path: [{lat: parseFloat(centrelat), lng: parseFloat(centrelong)}, {lat: parseFloat(calculatedLat), lng: parseFloat(calculatedLong)}],
			icons: [{
				icon: lineSymbol,
				offset: '100%'
				}],
			strokeColor: couleur,
			strokeOpacity: 0.8,
			//strokeWeight : 1,
			clickable : true,
			map: map
			});						
		fleche.setMap(map);
		arrowTab.push(fleche);
		//tabFleches[i] = fleche1;
		createAreaClickableInfo(fleche, 
				"Direction: " + direction + '<br>'
				+ "Type: " + descriptionColor + '<br>'
				+ "Cell id: " + numberRecColor + '<br>'
				+ "SW: " + tabLatitudeRecSW + "," + tabLongitudeRecSW
				+ '<br>' 
				+ "NE: " + tabLatitudeRecNE + "," + tabLongitudeRecNE,
				map);
	}

	/* --------------------------- CLEARMAP() --------------------------- */

	function clearMap(){
		clearColor();
		clearRectangles();
		clearArrow();
	}

	function clearRectangles() {
		if( tabArea ){
			for (var i = 0; i < tabArea.length; i++) {
				if( tabArea[i] ) tabArea[i].setMap(null);
			}
		}
	}

	function clearArrow(){
		if(arrowTab){
			for(var i = 0; i < arrowTab.length; i++){
				if( arrowTab[i] ) arrowTab[i].setMap(null);
			}
		}
		arrowTab = [];
	}
	

	function clearColor() {
		if( tabAreaColor ){
			for (var i = 0; i < tabAreaColor.length; i++) {
				if( tabAreaColor[i] ) tabAreaColor[i].setMap(null);
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

				// On retourne un tableau conteant les lignes du fichiers
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

	function areaTraitement( lines, _callback ) {

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
			idArea = lines[i].substring( 0, lines[i].indexOf( "|" ) );
			tabIdArea[i] = idArea;
			
			var locations = lines[i].split('|');
			
			// --- Sud West ( SW ) ---
			// locations[1] est le Sud West ( SW )
			var coordonnees = locations[1].split(',');
			
			// Coordonnées du Sud West ( SW )
			longitudeSW = coordonnees[0];
			latitudeSW = coordonnees[1];

			// Ajout des coordonnées du SW dans les taleaux des coordonnées
			tabLongitudeSW[i] = longitudeSW;
			tabLatitudeSW[i] = latitudeSW;
			
			// --- North East ( NE ) ---
			// locations[4] est le North East ( NE )
			var coordonnees = locations[4].split(',');
			
			// Coordonnées du North East ( NE )
			longitudeNE = coordonnees[0];
			latitudeNE = coordonnees[1];

			// Ajout des coordonnées du NW dans les taleaux des coordonnées
			tabLongitudeNE[i] = longitudeNE;
			tabLatitudeNE[i] = latitudeNE;
			
			// On créer notre zone
			area = new google.maps.Rectangle({
				strokeColor : '#3d3d29',
				strokeOpacity : 1,
				strokeWeight : 0.4,
				fillColor : '#3d3d29',
				clickable : true,//
				fillOpacity : 0.0,
				map : map,
				bounds : {
					north : parseFloat(latitudeNE),
					south : parseFloat(latitudeSW),
					west : parseFloat(longitudeSW),
					east : parseFloat(longitudeNE)
				}
			});

			area.setMap(map);
			infoWindow = new google.maps.InfoWindow();
			createClickablePoly(area, "Id : "
						+ numberRec + '<br>'  
						+ "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i]
						+ '<br>' 
						+ "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i],
						map);
			// On ajoute la zone dans le tableau contenant toutes les zones
			tabArea[i] = area;
		}

		_callback();
	}

	function areaColorTraitement( lines, cb ) {
		
		// Tableau permettant de stocker les zones coloré, permet de les supprimer de la carte si besoin
		tabAreaColor = [];

		// On effectue un parcours ligne par ligne
		
		for ( var i = 0 ; i < lines.length  ; i++ ) {
			
			// On récupère le numéro de la zone
			idColorArea = lines[i].substring( 0, lines[i].indexOf( " " ) );

			// On recupère le type de la zone
			typeArea = lines[i].substring( lines[i].lastIndexOf( " " ) + 1 );

			// Si la zone est bien présente sur la carte
			if ( idColorArea == tabIdArea[i] ) {
				
				// On parcours la map des couleurs à affecter en fonction du type de la zone
				for ( var indexMapAreaColor = 0 ; indexMapAreaColor < mapAreaColor.length ; indexMapAreaColor++ ) {
					
					// Affecte la bonne couleur en fonction de son nom, et applique la couleur par défaut si besoin
					if ( ( typeArea == mapAreaColor[ indexMapAreaColor ].name ) || ( indexMapAreaColor == mapAreaColor.length - 1 ) ) {
						
						// On crée la zone coloré en fonction de la couleur donné par la map des couleurs à affecter en fonction du type de la zone
						areaColor = new google.maps.Rectangle({
							strokeColor : mapAreaColor[ indexMapAreaColor ].color,
							strokeOpacity : 0,
							strokeWeight : 0,
							fillColor : mapAreaColor[ indexMapAreaColor ].color,
							clickable : true,
							fillOpacity : 0.8,
							map : map,
							bounds : {
								north : parseFloat(tabLatitudeNE[i]),
								south : parseFloat(tabLatitudeSW[i]),
								west : parseFloat(tabLongitudeSW[i]),
								east : parseFloat(tabLongitudeNE[i])
							}
						});

						// On affecte la zone coloré à la carte
						areaColor.setMap(map);

						// On ajoute la zone coloré dans le tableau contenant toutes les zones colorés
						tabAreaColor[i] = areaColor;

						// On rend la zone coloré cliquable, quand celle-ci est cliqué des informations tel que son id, son type, et ses coordonées spatiales 
						createAreaClickableInfo(areaColor, "Id : "
										  + idColorArea + '<br>' + "Type: "
											+ mapAreaColor[ indexMapAreaColor ].name + '<br>' 
										  + "SW: " + tabLatitudeSW[i] + "," + tabLongitudeSW[i]
										  + '<br>' 
										  + "NE: " + tabLatitudeNE[i] + "," + tabLongitudeNE[i],
											map);	

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
			
			//document.write(lines[i]);
			
			numberRec = lines[i].substring(0, lines[i].indexOf("|", 0));
			tabNumberRec[i] = numberRec;
			
			var points = lines[i].split('|');
			
			//document.write("id= "+points[0]+"<br>");
			
			//point[1] est le SW
			var coordonnees = points[1].split(",");
			longitudeRecSW = coordonnees[0];
			latitudeRecSW = coordonnees[1];
			//document.write(longitudeRecSW+" , "+latitudeRecSW+"<br>");
			tabLongitudeRecSW[i] = longitudeRecSW;
			tabLatitudeRecSW[i] = latitudeRecSW;
			
			//point[2] est le SE
			var coordonnees = points[2].split(",");
			longitudeRecSE = coordonnees[0];
			latitudeRecSE = coordonnees[1];
			//document.write(longitudeRecSW+" , "+latitudeRecSW+"<br>");
			tabLongitudeRecSE[i] = longitudeRecSE;
			tabLatitudeRecSE[i] = latitudeRecSE;
			
			//point[3] est le NW
			var coordonnees = points[3].split(",");
			longitudeRecNW = coordonnees[0];
			latitudeRecNW = coordonnees[1];
			//document.write(longitudeRecSW+" , "+latitudeRecSW+"<br>");
			tabLongitudeRecNW[i] = longitudeRecNW;
			tabLatitudeRecNW[i] = latitudeRecNW;
			
			//point[4] est le NE
			coordonnees = points[4].split(",");
			longitudeRecNE = coordonnees[0];
			latitudeRecNE = coordonnees[1];
			//document.write(longitudeRecNE+" , "+latitudeRecNE+"<br>");
			tabLongitudeRecNE[i] = longitudeRecNE;
			tabLatitudeRecNE[i] = latitudeRecNE;
			
			rectangle = new google.maps.Rectangle({
				strokeColor : '#3d3d29',
				strokeOpacity : 1,
				strokeWeight : 0.4,
				fillColor : '#3d3d29',
				//clickable : true,//
				fillOpacity : 0.0,
				map : map,
				bounds : {
					north : parseFloat(latitudeRecNE),
					south : parseFloat(latitudeRecSW),
					west : parseFloat(longitudeRecSW),
					east : parseFloat(longitudeRecNE)
				}
			});

			tabArea[i] = rectangle;

		}
		_callback();		
	}

	function areaColorTraitementSeq(lines, cb ){

		tabAreaColor = [];

		var lineSymbol = {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
		};

		var lineSymbolB = {
			path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
		};

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
				
				//selon la direction faire fleche (a partir du centre de la cellule concernee)
				// avec la couleur du type

				var centrelat = (parseFloat(tabLatitudeRecSW[i]) + parseFloat(tabLatitudeRecNE[i]) + parseFloat(tabLatitudeRecNW[i]) + parseFloat(tabLatitudeRecSE[i])) / 4;
				var centrelong = (parseFloat(tabLongitudeRecSW[i]) + parseFloat(tabLongitudeRecNE[i]) + parseFloat(tabLongitudeRecNW[i]) + parseFloat(tabLongitudeRecSE[i])) / 4;
				
				//direction : N S E W NE NW SW SE NONE
				if(direction == "N") {
					var nordlat = parseFloat(tabLatitudeRecNE[i]);
					var nordlong = (parseFloat(tabLongitudeRecNE[i]) + parseFloat(tabLongitudeRecNW[i])) / 2;

					drawLine(centrelat, centrelong, nordlat, nordlong, lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);
					
				} else if(direction == "S") {
					var sudlat = parseFloat(tabLatitudeRecSE[i]);
					var sudlong = (parseFloat(tabLongitudeRecSE[i]) + parseFloat(tabLongitudeRecSW[i])) / 2;

					drawLine(centrelat, centrelong, sudlat, sudlong, lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

				} else if(direction == "E") {
					var estlat = (parseFloat(tabLatitudeRecNE[i]) + parseFloat(tabLatitudeRecSE[i])) / 2;
					var estlong = parseFloat(tabLongitudeRecNE[i]);

					drawLine(centrelat, centrelong, estlat, estlong, lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

				} else if(direction == "NE") {
					
					drawLine(centrelat, centrelong, tabLatitudeRecNE[i], tabLongitudeRecNE[i], lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

				} else if(direction == "NW") {

					drawLine(centrelat, centrelong, tabLatitudeRecNW[i], tabLongitudeRecNW[i], lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);
				} else if(direction == "SW") {
					
					drawLine(centrelat, centrelong, tabLatitudeRecSW[i], tabLongitudeRecSW[i], lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

				} else if(direction == "SE") {

					drawLine(centrelat, centrelong, tabLatitudeRecSE[i], tabLongitudeRecSE[i], lineSymbol, couleur, 
						map, direction, descriptionColor, numberRecColor, tabLatitudeRecSW, tabLatitudeRecNE);

				} else { // on fait un rectangle
					
					// On parcours la map des couleurs à affecter en fonction du type de la zone
					for ( var indexMapAreaColor = 0 ; indexMapAreaColor < mapAreaColor.length ; indexMapAreaColor++ ) {
					
						// Affecte la bonne couleur en fonction de son nom, et applique la couleur par défaut si besoin
						if ( ( descriptionColor == mapAreaColor[ indexMapAreaColor ].name ) || ( indexMapAreaColor == mapAreaColor.length - 1 ) ) {
						
							rectangle1 = new google.maps.Rectangle({
								strokeColor : mapAreaColor[ indexMapAreaColor ].color,
								strokeOpacity : 0,
								strokeWeight : 0,
								fillColor : mapAreaColor[ indexMapAreaColor ].color,
								clickable : true,
								fillOpacity : 0.5,
								map : map,
								bounds : {
									north : parseFloat(tabLatitudeRecNE[i]),
									south : parseFloat(tabLatitudeRecSW[i]),
									west : parseFloat(tabLongitudeRecSW[i]),
									east : parseFloat(tabLongitudeRecNE[i])
								}
		
							});
					
							rectangle1.setMap(map);
							
							tabAreaColor[i] = rectangle1;

							if(champs.length == 2) {
								infoWindow = new google.maps.InfoWindow();
								createAreaClickableInfo(rectangle1, "Id: "
										+ numberRecColor + '<br>' + "Type: "
										+ descriptionColor + '<br>' 
										+ "SW: " + tabLatitudeRecSW[i] + "," + tabLongitudeRecSW[i]
										+ '<br>' 
										+ "NE: " + tabLatitudeRecNE[i] + "," + tabLongitudeRecNE[i],
										map);
							}

							break;
						}
					}
				}
			}
		}
		cb();
	}

	