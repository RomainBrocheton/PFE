app.factory('connectionFactory', function( $http ) {

    var factory = {};

    factory.login = function( email, password, cb ){

        var data = {
            email : email,
            password : password
		};
	   
		$http.post('/login', data ).then(function ( response ) {
            cb( response.data );
            
		}).catch( function( response ){
            
            cb( { 
                success : false,
                error : "There is a problem during your connection, please try again " 
            } );
            
		});
    }
    
    factory.register = function(email, password, cb){

        var data = {
            email : email,
            password : password
        }
  
        $http.post('/register', data )
        .then(function ( response ) {
            
            cb( response.data );

        }).catch( function( response ){

            cb( { 
                success : false ,
                error : "There is a problem during the registration, please try again"
            } );

        });
    }

    factory.getPermission = function( cb ){

        var data = {
            token : localStorage.getItem( "token" )
        }
  
        $http.post('/getPermission', data )
        .then(function ( response ) {
            
            cb( response.data );

        }).catch( function( response ){

            cb( { 
                success : false,
                error : "There is a problem during the check of yours permission, please try again" 
            } );
            
        });
    }

    return factory;

});