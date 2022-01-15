var mongo = require('../database/files');

var fs = require('fs');
var miscellaneous = require('./miscellaneous');

module.exports = {

    doesExist : function(email, data, cb){

        mongo.doesExist( data.city, data.latitude, data.longitude, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, email, function( result ) {
            cb(result);
        });

    },    
    
    insertFiles : function(email, data, response){
            
        // GRIDFILE
        var grifFileName = "grid" + data.city + data.period + data.granularity + data.thresholdVehicule + data.timeDivisionStart + data.timeDivisionEnd + data.direction + email;

        var gridFileLines = ''
        for(i = 0; i < data.gridFileLines.length ; i = i + 1 ){
            if( data.gridFileLines[i] != '' ){
                gridFileLines = gridFileLines + data.gridFileLines[i] + '\n';
            }
        }

        fs.writeFile( grifFileName + '.txt', gridFileLines, (err) => {
            if (err){
                response.send( {
                    success : false,
                    error : "It's not possible to write the gridFile \'" + grifFileName + ".txt\'"
                });
            }

            // COLORFILE
            var colorFileName = "color" + data.city + data.period + data.granularity + data.thresholdVehicule + data.timeDivisionStart + data.timeDivisionEnd + data.direction + email;

            var colorFileLines = ''
            for(i = 0; i < data.colorFileLines.length ; i = i + 1 ){
                if( data.colorFileLines[i] != '' ){
                    colorFileLines = colorFileLines + data.colorFileLines[i] + '\n';
                }
            }

            fs.writeFile( colorFileName + '.txt', colorFileLines, (err) => {
                if (err){
                    response.send( {
                        success : false,
                        error : "It's not possible to write the colorFile \'" + grifFileName + ".txt\'"
                    });
                }

                mongo.insertFiles( email, data.city, data.latitude, data.longitude, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, grifFileName, colorFileName, function( result ) {
                 
                    response.send( {
                        success : result
                    });
                });
            });
        });
    },

    deleteFiles : function(email, data, response){
        
        mongo.isMyFile( data.city, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, email, function( success ){
            if( success ){
                mongo.deleteFiles( data.city, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, email, function(result){
                    var data = {
                        result : result
                    };
                
                    response.send( data );
                });
            }
        });
    },

    getGridFile : function( email, data, response){

        mongo.getGridFile( data.city, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, data.author, function(result){

            var data = {
                success : result.success,
                result : result
            };
            response.send( data );
        });
    },

    getColorFile : function(email, data, response){
        mongo.getColorFile( data.city, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, data.author, function(result){
            var data = {
                success : result.success,
                lines : result.lines
            }
            response.send( data );
        });
    },

    isMyFile : function( data, email, response ){

        mongo.isMyFile( data.city, data.period, data.granularity, data.thresholdVehicule, data.timeDivisionStart, data.timeDivisionEnd, data.direction, email, function( success ){
            var result = {
                success : success
            };
                        
            response.send( result );
        })
    }
}