var database = require('./mongo');
var uuidv4 = require('uuidv4');

module.exports = {
    getLocation : function( city, cb ){

        database.getDataModel().findOne({'city' : city}, function(err, res){  

            cb(res.longitude,  res.latitude);
        });
    },

    getCityAvailable : function( cb ){

        database.getDataModel().find( function(err, res) {
           
            var taille = res.length;
            var cities = [];
            var alreadyContains;
            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < cities.length && !alreadyContains ; j++ ){
                    if( cities[j].includes(res[i].city) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    cities[cities.length] = res[i].city;
                }    
            }
            
            cb(cities);
        });
    },

    getPeriodAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city}, function(err, res){
           
            var taille = res.length;
            var periods = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < periods.length && !alreadyContains ; j++ ){
                    if( periods[j].includes(res[i].period) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    periods[periods.length] = res[i].period;
                }                
            }
            
            cb(periods);
        });
        
    },

    getGranularityAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city, 'period': data.period}, function(err, res){
            
            var taille = res.length;
            var granularities = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < granularities.length && !alreadyContains ; j++ ){
                    if( granularities[j].includes(res[i].granularity) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    granularities[granularities.length] = res[i].granularity;
                } 
            }
        
            cb(granularities);
        });
        //granularities = [ '10', '20'];

        //cb(granularities);
    },

    getThresholdVehiculeAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city, 'period': data.period, 'granularity': data.granularity}, function(err, res){
            
            var taille = res.length;
            var thresholdVehicules = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < thresholdVehicules.length && !alreadyContains ; j++ ){
                    if( thresholdVehicules[j].includes(res[i].thresholdVehicule) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    thresholdVehicules[thresholdVehicules.length] = res[i].thresholdVehicule;
                } 
            }
        
            cb(thresholdVehicules);
        });

    },

    getDirectionAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city, 'period': data.period, 'granularity': data.granularity, 'thresholdVehicule': data.thresholdVehicule}, function(err, res){
            
            var taille = res.length;
            var directions = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < directions.length && !alreadyContains ; j++ ){
                    if( directions[j].includes(res[i].direction) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    directions[directions.length] = res[i].direction;
                } 
            }
        
            cb(directions);
        });

    },

    getTimeDivisionStartAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city, 'period': data.period, 
        'granularity': data.granularity, 'thresholdVehicule': data.thresholdVehicule}, function(err, res){
            
            var timeDivisionStarts = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < timeDivisionStarts.length && !alreadyContains ; j++ ){
                    if( timeDivisionStarts[j].includes(res[i].timeDivisionStart) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    timeDivisionStarts[timeDivisionStarts.length] = res[i].timeDivisionStart;
                } 
            }
        
            cb(timeDivisionStarts);
        });

    },

    getTimeDivisionEndAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city, 'period': data.period, 
        'granularity': data.granularity, 'thresholdVehicule': data.thresholdVehicule, 
        'timeDivisionStart' : data.timeDivisionStart }, function(err, res){
            
            var timeDivisionEnds = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < timeDivisionEnds.length && !alreadyContains ; j++ ){
                    if( timeDivisionEnds[j].includes(res[i].timeDivisionEnd) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    timeDivisionEnds[timeDivisionEnds.length] = res[i].timeDivisionEnd;
                } 
            }
        
            cb(timeDivisionEnds);
        });

    },

    getAuthorAvailable : function( data, cb ){

        database.getDataModel().find({'city' : data.city, 'period': data.period, 
        'granularity': data.granularity, 'thresholdVehicule': data.thresholdVehicule, 'direction':data.direction, 
        'timeDivisionStart':data.timeDivisionStart, 'timeDivisionEnd':data.timeDivisionEnd }, function(err, res){
            
            var authors = [];
            var alreadyContains;

            for(i=0; i<res.length; i++){

                alreadyContains = false;

                for( j=0 ; j < authors.length && !alreadyContains ; j++ ){
                    if( authors[j].includes(res[i].author) ){
                        alreadyContains = true;
                    }
                }
                
                if( !alreadyContains ){
                    authors[authors.length] = res[i].author;
                } 
            }
        
            cb(authors);
        });

    }
}