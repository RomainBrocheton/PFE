var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var miscellaneous = require('./miscellaneous');
var mongo = require('../database/connection');

module.exports = {

    login : function( email, password, response ) {

        mongo.emailIsUse( email, function( emailIsUse ){
    
            if( emailIsUse ){

                mongo.isGoodPassword( email, crypto.createHash('sha256').update( password + miscellaneous.salt).digest('hex'), function( goodPassword ){

                    var data;

                    if( goodPassword ){

                        const token = jwt.sign( { email: email },
                                                  miscellaneous.userTokenKey );

                        data = {
                            success : true,
                            token : token
                        };

                    }else{

                        data = {
                            success : false,
                            error : "Bad login or password"
                        };
                    }
            
                    response.send(data);
                });
            }else{
                var data = {
                    success : false,
                    error : "Bad login or password"
                };
        
                response.send(data);
            }
        });

    },

    register : function( email, password, response ) {

        mongo.emailIsUse( email, function( use ){

            var data;

            if( !use ){

                mongo.addUser( email, crypto.createHash('sha256').update( password + miscellaneous.salt).digest('hex'), function( succes ){
                    
                    if( succes ){
                        data = {
                            success : true
                        }
                    }else{
                        data = {
                            success : false,
                            error : "There is a problem with the user registration"
                        }
                    }

                    response.send( data );
                } );

            }else{

                var data = {
                    success : false,
                    error : "Email is already use"
                };

                response.send( data );

            }
            
        });
    },

    emailIsAlreadyUse : function( email, response ){

        mongo.emailExist( email, function( available ){
           
            var data = {
                available : available
            };
    
            response.send( data );
        });
    },

    getPermission : function(email, response){
        mongo.getPermission(email, function(rank){
            var data = {
                rank : rank
            };
    
            response.send( data );
        })
    }
}