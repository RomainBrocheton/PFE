app.controller('connectionController', function( $scope, connectionFactory, languageFactory, $location ) {

    $scope.init = function(){
        languageFactory.setLanguage( $scope, document.getElementsByTagName("html")[0].lang, function(){
        });
    }

    $scope.login = function() {
        
        if( $scope.email && $scope.password ){
            
            connectionFactory.login( $scope.email, $scope.password, function( result ){
                if( result.success ){

                    localStorage.setItem('token', result.token );

                    clearMap();
                    $location.path( MANUAL_VISUALISATION );

                }else{

                    hide('#error');

                    $scope.error = result.error;

                    display('#error');
                }
            });
        }else{
            hide('#error');

            if( !$scope.email ){

                $scope.error = $scope.text.error.login.EMAIL_IS_MISSING;

            }else if( !$scope.password ){

                $scope.error = $scope.text.error.login.PASSWORD_IS_MISSING;
                
            }

            display('#error');

        }
    };
    
    $scope.register = function() {

        if( $scope.email && $scope.password && $scope.confirmPassword && $scope.password == $scope.confirmPassword ){
            
            connectionFactory.register( $scope.email, $scope.password, function( result ){

                if( result.success ){

                    $location.path( LOGIN );

                }else{
                    
                    hide('#error');

                    $scope.error = result.error;

                    display('#error');
                }
            });
        }else{

            hide('#error');

            if( !$scope.email ){
                $scope.error = $scope.text.error.register.EMAIL_IS_MISSING;
            }
            else if( !$scope.password ){
                $scope.error = $scope.text.error.register.PASSWORD_IS_MISSING;
            }
            else if( !$scope.confirmPassword ){
                $scope.error = $scope.text.error.register.CONFIRMATION_PASSWORD_IS_MISSING;
            }
            else if( $scope.password != $scope.confirmPassword ){
                $scope.error = $scope.text.error.register.PASSWORD_ARE_NOT_THE_SAME;
            }

            display('#error');
        }
    };
});