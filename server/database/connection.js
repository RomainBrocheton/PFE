var database = require('./mongo');
var uuidv4 = require('uuidv4');

module.exports = {

    addUser: function( email, password, cb ){   

        var userToSave = database.newUserModel();
        userToSave._id = uuidv4();
        userToSave.email = email;
        userToSave.password = password;

        userToSave.save( function( error ){
            
            if( error ){
                cb( false );
            }else{
                cb( true );
            }

        });
    },
    
    emailIsUse: function( email, cb ){   
        
        database.getUserModel().findOne( { email : email }, function ( error, user ) {
            if( error ){
                cb( error );
            }else{

                if( user ){
                    cb(true);
                }else{
                    cb(false);
                }
            }
        });  
    },

    isGoodPassword : function( email, password, cb ){

        database.getUserModel().findOne( {email : email}, function ( error, user ) {

            if( error ){
                cb( error );
            }else{
                if( user.password == password ){
                    cb( true );
                }else{
                    cb( false );
                }
            }
        });  
    },

    getPermission : function(email, cb){
        database.getUserModel().findOne( {email : email}, function ( error, user ) {

            if( error ){
                cb( error );
            }else{
                cb(user.rank);
            }
        });  
    }

}