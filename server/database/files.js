var database = require('./mongo');
const { v4: uuidv4 } = require('uuid');

// ---------- Gridfs connexion ----------

var conn = database.getMongoose().connection;

var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = database.getMongoose().mongo;

var gfs;
conn.once('open', function () {
    gfs = Grid(conn.db);
});

module.exports = {

    doesExist : function( city, latitude, longitude, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, email, cb ){

        database.getDataModel().findOne({'city': city, 'longitude':longitude, 'latitude':latitude, 'period':period, 'granularity':granularity, 'thresholdVehicule':thresholdVehicule, 'direction':direction, 'timeDivisionStart':timeDivisionStart, 'timeDivisionEnd':timeDivisionEnd, 'author':email }, function(err, file){
            
            if(file == null){
                cb(true);
            }else{
                cb(false);
            }
            
        });
    },


    insertFiles : function( email, city, latitude, longitude, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, grifFileName, colorFileName, cb ){

        var dataModel = database.getDataModel();
        var FileToSave = new dataModel({
            _id:uuidv4(),
            city : city,
            latitude : latitude,
            longitude : longitude,
            period : period,
            granularity : granularity,
            thresholdVehicule : thresholdVehicule,
            timeDivisionStart : timeDivisionStart,
            timeDivisionEnd : timeDivisionEnd,
            direction : direction,
            author : email
        });
 
        FileToSave.save(function(err){
            if (err) throw err;
        });

        var target = gfs.createWriteStream({
            filename: grifFileName+ '.txt',
            metadata : grifFileName
        });

        var source = fs.createReadStream( grifFileName+ '.txt' );
        source.pipe( target );

        target.on('close', function (file) {
        
            fs.unlink( grifFileName + '.txt' , (err) => {
                if (err) console.log( err );
            });
        }); 

        // Traitement color

        var target2 = gfs.createWriteStream({
            filename: colorFileName + '.txt',
            metadata : colorFileName
        });

        var source2 = fs.createReadStream( colorFileName + '.txt'  );
        source2.pipe( target2 );

        target2.on('close', function (file) {
       
            fs.unlink( colorFileName + '.txt' , (err) => {
                if (err) throw err;
            });
        }); 

        cb( true );
    },

    deleteFiles : function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, email, cb){

        var key = "grid" + city + period + granularity + thresholdVehicule + timeDivisionStart + timeDivisionEnd + direction + email;

        database.getFileModel().findOne({'metadata': key}, function(err, file){
            if(err){
                throw err;
            }else{
                    if( file ){
                    var id = database.newObjectId(file._id);
                    
                    database.getFileModel().findByIdAndRemove(id, function(err, res){
                        if(err){
                            throw err;
                        }
                    });

                    database.getChunkModel().find( {'files_id': id}, function(err, res){
                        if(err){
                            throw err;
                        }else{
                            
                            var i = 0;
                            var str = [];
                            for(i = 0; i<res.length; i++ ){
                                str[i] = res[i]._id;
                            }
                            for( var j = 0; j <str.length; j++){

                                var det = database.newObjectId(str[j]);
                                database.getChunkModel().findByIdAndRemove(det, function(err, res){
                                    if(err){
                                        throw err;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        key = "color" + city + period + granularity + thresholdVehicule + timeDivisionStart + timeDivisionEnd + direction + email;

        database.getFileModel().findOne({'metadata': key}, function(err, file){
            if(err){
                throw err;
            }else{
                if( file ){
                    var id = database.newObjectId(file._id);
                    database.getFileModel().findByIdAndRemove(id, function(err, res){
                        if(err){
                            throw err;
                        }
                    })
                    database.getChunkModel().find( {'files_id': id}, function(err, res){
                        if(err){
                            throw err;
                        }else{
                            
                            var i = 0;
                            var str = [];
                            for(i = 0; i<res.length; i++ ){
                                str[i] = res[i]._id;
                            }
                            for( var j = 0; j <str.length; j++){
    
                                var det = database.newObjectId(str[j]);
                                database.getChunkModel().findByIdAndRemove(det, function(err, res){
                                    if(err){
                                        throw err;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        database.getDataModel().findOneAndRemove({'city' : city, 'period':period, 
                                                'granularity':granularity, 'thresholdVehicule':thresholdVehicule,
                                                'direction' : direction, 'timeDivisionStart':timeDivisionStart, 'author':email}, 
                                                function(err, res){
            if(err){
                throw err;
            }
        });
        
        cb({ result : true });   

     },

    getGridFile : function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, email, cb ){
        
        var key = "grid" + city + period + granularity + thresholdVehicule + timeDivisionStart + timeDivisionEnd + direction + email;

        database.getFileModel().findOne({'metadata': key}, function(err, file){
            if(err){
                cb( err );
            }else{

                var id = database.newObjectId( file._id );

                database.getChunkModel().find({'files_id': id}, function(err, res){
                    if(err){
                        cb(err);
                        throw err;
                    }else{
                        
                        var i = 0;
                        var str = '';

                        for(i = 0; i<res.length; i++ ){
                            str = str + res[i].data;
                        }

                        if( str ) var lines = str.split('\n');
                        else var lines = '';

                        cb({
                            success : true,
                            lines : lines
                        });
                    }
                });

            }
        });
        
    },

    getColorFile : function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, email, cb ){
        
        var key = "color" + city + period + granularity + thresholdVehicule + timeDivisionStart + timeDivisionEnd + direction + email;

        database.getFileModel().findOne({'metadata': key}, function(err, file){
            if(err){
                throw err;
            }else{
                var id = database.newObjectId(file._id);
                
                database.getChunkModel().find({'files_id': id}, function(err, res){
                    if(err){
                        throw err;
                    }else{
                        var i = 0;
                        var str = '';

                        for(i = 0; i<res.length; i++ ){
                            str = str + res[i].data;
                        }
                        
                        if( str ) var lines = str.split('\n');
                        else var lines = '';

                        cb( {
                            success : true,
                            lines : lines
                        } );
                    }
                });

            }
        });
    },

    isMyFile : function( city, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, email, cb ){
        
        database.getDataModel().findOne({'city': city, 'period':period, 'granularity':granularity, 'thresholdVehicule':thresholdVehicule, 'direction':direction, 'timeDivisionStart':timeDivisionStart, 'timeDivisionEnd':timeDivisionEnd, 'author':email }, function(err, file){
            if(file == null){
                cb(false);
            }else{
                cb(true);
            }
            
        });
    }

}