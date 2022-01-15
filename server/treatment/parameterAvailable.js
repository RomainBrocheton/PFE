var mongo = require('../database/parameterAvailable');

module.exports = {

    getLocation : function( city, response ){

        mongo.getLocation( city, function( longitude, latitude ) {
              
            var data = {
                longitude : longitude,
                latitude : latitude
            };
    
            response.send( data );
         
        });
    },

    getCityAvailable : function(response){

        mongo.getCityAvailable( function( cities ) {
              
            var data = {
                cities : cities
            };
            
            response.send( data );
        });
    },

    getPeriodAvailable : function(data, response){

        mongo.getPeriodAvailable( data, function( periods ) {
              
            var result = {
                periods : periods
            };
            
            response.send(result);
        });
    },

    getGranularityAvailable : function(data, response){

        mongo.getGranularityAvailable(data, function( granularities ) {
              
            var result = {
                granularities : granularities
            };
            
            response.send(result);
        });
    },

    getThresholdVehiculeAvailable : function(data, response){

        mongo.getThresholdVehiculeAvailable(data, function( seqs ) {
            var result = {
                seqs : seqs
            };
            
            response.send(result);
        });
    },

    getDirectionAvailable : function(data, response){

        mongo.getDirectionAvailable(data, function( seqs ) {
            var result = {
                seqs : seqs
            };
            
            response.send(result);
        });
    },

    getTimeDivisionStartAvailable : function(data, response){
        mongo.getTimeDivisionStartAvailable(data, function( temps ) {
            var result = {
                temps : temps
            };
            
            response.send(result);
        });
    },
    
    getTimeDivisionEndAvailable : function(data, response){
        mongo.getTimeDivisionEndAvailable(data, function( temps ) {
            var result = {
                temps : temps
            };
            
            response.send(result);
        });
    },

    getAuthorAvailable : function( data, response ){
        
        mongo.getAuthorAvailable(data, function( authors ) {
            var result = {
                seqs : authors
            };
            
            response.send(result);
        });
    }
}