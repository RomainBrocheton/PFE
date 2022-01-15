app.controller('navigationController', function( $scope, connectionFactory, $location ) {

    $scope.init = function(){
        
        connectionFactory.getPermission(function(result){
           
            if( !result.success && ! ( $location.url() == MANUAL_VISUALISATION || $location.url() == HOME || $location.url() == LOGIN || $location.url() == REGISTER ) ){
                $location.path( MANUAL_VISUALISATION );
            } else {
                $scope.connected = result.success;
            }
        });
    };

    $scope.logout = function(){
        
        localStorage.removeItem( "token" );

        document.location.reload(true);
    }

    $scope.goLogin = function(){
        $location.path( LOGIN );
    }

    $scope.goRegister = function(){
        $location.path( REGISTER );
    }

    $scope.assistedVisualisation = function(){
        clearMap();
        $location.path( ASSISTED_VISUALISATION );
    };
 
    $scope.manualVisualisation = function(){
        clearMap();
        $location.path( MANUAL_VISUALISATION );
    };

    $scope.manualInsertion  = function(){
        clearMap();
        $location.path( MANUAL_INSERTION );
    };

    $scope.assistedInsertion  = function(){
        clearMap();
        $location.path( ASSISTED_LOGIN );
    };

    $scope.home = function(){
        $location.path( HOME );
    }

});
