app.factory('dataFactory', function( $http ) {

	var factory = {};
  
	factory.getLocation = function( city, cb ){
		var requete = {
			city : city,
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getLocation', requete )
		.then(function ( response ) {
			cb(response.data.longitude, response.data.latitude);
		})
		.catch( function( response ){
			cb( "It's not possible to get the location of the city'" + city );
		});
	}

	factory.getCityAvailable = function( cb ){

		var requete = {
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getCityAvailable', requete )
		.then(function ( response ) {
			cb(response.data.cities);
		})
		.catch( function( response ){
			cb( "Its not possible to get all the cities available : " + response );
		});
	};
	
	factory.getPeriodAvailable = function( city, cb ){

		var data = {
			city : city
		};

		var requete = {
			data : data,
			token : localStorage.getItem( "token" ),
		};
	   
		$http.post('/getPeriodAvailable', requete )
		.then(function ( response ) {
			cb(response.data.periods);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the periods available for the city'" + city + "' : " + response );
		});
	};
  
	factory.getGranularityAvailable = function( city, period, cb ){

		var data = {
			city : city,
			period : period
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" ),
		};
	   
		$http.post('/getGranularityAvailable', requete )
		.then(function ( response ) {
			cb(response.data.granularities);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the granularities available for the city'" + city + "' and the period '" + period + "' : " + response );
		});
	};

	factory.getThresholdVehiculeAvailable = function( city, period, granularity, cb ){

		var data = {
            city : city,
            period : period,
            granularity : granularity
		}
		
		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getThresholdVehiculeAvailable', requete )
		.then(function ( response ) {
			cb(response.data.seqs);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the seq available for the city'" + city + "' and the period '" + period + "' : " + response );
		});
	};


	factory.getTimeDivisionStartAvailable = function( city, period, granularity, thresholdVehicule, cb ){

		var data = {
			city : city, 
			period : period, 
			granularity : granularity, 
			thresholdVehicule : thresholdVehicule
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getTimeDivisionStartAvailable', requete )
		.then(function ( response ) {
			cb(response.data.temps);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the temp available for the city'" + city + "' and the period '" + period + "' : " + response );
		});
	};

	factory.getTimeDivisionEndAvailable = function( city, period, granularity, thresholdVehicule, timeDivisionStart, cb ){

		var data = {
			city : city, 
			period : period, 
			granularity : granularity, 
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
	   
		
		$http.post('/getTimeDivisionEndAvailable', requete )
		.then(function ( response ) {
			cb(response.data.temps);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the temp available for the city'" + city + "' the period '" + period + "' : " + response );
		});
	};

	factory.getDirectionAvailable = function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, cb ){

		var data = {
			city : city, 
			period : period, 
			granularity : granularity, 
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getDirectionAvailable', requete )
		.then(function ( response ) {
			cb(response.data.seqs);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the seq available for the city'" + city + "' and the period '" + period + "' : " + response );
		});
	};

	factory.getAuthorAvailable = function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, cb ){

		var data = {
			city : city, 
			period : period, 
			granularity : granularity, 
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd,
			direction : direction
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};
	   
		$http.post('/getAuthorAvailable', requete )
		.then(function ( response ) {
			cb(response.data.seqs);
		})
		.catch( function( response ){
			cb( "It's not possible to get all the seq available for the city'" + data.city + "' and the period '" + data.period + "' : " + response );
		});
	};

	factory.isMyfile = function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, cb ){

		var data = {
			city : city, 
			period : period, 
			granularity : granularity, 
			thresholdVehicule : thresholdVehicule,
			timeDivisionStart : timeDivisionStart,
			timeDivisionEnd : timeDivisionEnd,
			direction : direction
		}

		var requete = {
			data : data,
			token : localStorage.getItem( "token" )
		};

		$http.post('/isMyFile', requete )
		.then(function ( response ) {
			cb( response.data.success );
		})
		.catch( function( response ){
			cb( "It's not possible to know if it's your file or not");
		});
	};

	return factory;  
});
