app.factory('fileFactory', function( $http ) {
  
	var factory = {};
  
	factory.insertFiles = function ( city, latitude, longitude, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, gridFileLines, colorFileLines, cb ) {
		
		var data = {
			city : city, 
			latitude : latitude,
			longitude : longitude,
			period : period, 
			granularity : granularity, 
			thresholdVehicule : thresholdVehicule, 
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd,
			direction : direction,
			gridFileLines : gridFileLines,
			colorFileLines : colorFileLines
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};

		$http.post('/insertFiles', requete )
		.then(function ( response ) {
			cb(response.data);
		})
		.catch( function( response ){
			cb( "It's not possible to insert the files for the city'" + data.city + "' ,the period '" + data.period + "' and the granularity '" + data.granularity + "' : " + response );
		});
	};

	factory.getGridFile = function ( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, author, cb ) {
  
		var data = {
			city : city,
			period : period,
			granularity : granularity,
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd,
			direction : direction,
			author : author
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getGridFile', requete )
		.then(function ( response ) {
			
			cb( response.data.result );

		})
		.catch( function( response ){

			cb( false );
		});
	};

	factory.getColorFile = function ( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, author, cb ) {
  
		var data = {
			city : city,
			period : period,
			granularity : granularity,
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd,
			direction : direction,
			author : author
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};

		$http.post('/getColorFile', requete )
		.then(function ( response ) {
			cb( response.data.lines );
		})
		.catch( function( response ){
			cb( "It's not possible to get the colorFile for the city'" + city + "' ,the period '" + period + "' and the granularity '" + granularity + "' : " + response );
		});
	};
  
	factory.deleteFiles = function ( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, author, cb ) {
		
		var data = {
			city : city,
			period : period,
			granularity : granularity,
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd,
			direction : direction,
			author : author
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
		
		$http.post('/deleteFiles', requete )
		.then(function ( response ) {
			cb(response.result);
		})
		.catch( function( response ){
			cb( "It's not possible to delete the files for the city'" + city + "' ,the period '" + period + "', the granularity '" + granularity + " and the seq turned to " + seq + "' : " + response );
		});
	};

	factory.insertRawFile = function( rawFileLines, cb ){

		var requete = {
			rawFileLines : rawFileLines,
			token : localStorage.getItem( "token" )
		};

		$http.post('/insertRawFile', requete )
		.then(function ( response ) {
			cb(response.data);
		})
		.catch( function( response ){
			cb( "It's not possible to insert the raw files" + response );
		});
	}

	return factory;
});
  