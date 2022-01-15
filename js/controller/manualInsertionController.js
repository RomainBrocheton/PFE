app.controller('manualInsertionController', function( $scope, fileFactory, languageFactory ) {

    $scope.init = function(){
        languageFactory.setLanguage( $scope, document.getElementsByTagName("html")[0].lang, function(){
        });
    }
    
    $scope.insert = function(){

        var gridFile = document.getElementById("addGridFile").files[0];
        var colorFile = document.getElementById("addColorFile").files[0];
        
        if( $scope.city && $scope.longitude && $scope.latitude && $scope.period 
            && $scope.granularity && $scope.thresholdVehicule && $scope.timeDivisionStart && $scope.timeDivisionEnd && $scope.direction && gridFile && colorFile) {

            readFile( gridFile, function( gridFilename, gridFileLines ){

                if( gridFileLines.length == 0 ){
                    hide('#error');
                
                    $scope.error = $scope.text.error.manualVisualisation.EMPTY_GRID_FILE;

                    display('#error');
                } else {

                    readFile( colorFile, function( colorFilename, colorFileLines ){
            
                        if( colorFileLines.length == 0 ){
                            hide('#error');
                
                            $scope.error = $scope.text.error.manualVisualisation.EMPTY_COLOR_FILE;
        
                            display('#error');
                        } else {
                
                            fileFactory.insertFiles( $scope.city, $scope.latitude, $scope.longitude, $scope.period, $scope.granularity, $scope.thresholdVehicule, $scope.timeDivisionStart, $scope.timeDivisionEnd, $scope.direction, gridFileLines, colorFileLines, function( result ){
                
                                if( result.success ){
                
                                    $("#controlPanel").animate({ scrollTop: 0 }, "slow");
                
                                    hide('#success');
                
                                    $scope.success = $scope.text.success.manualVisualisation.SUCCESSFUL_INSERTION;
                                    
                                    display('#success');
                
                                }else{
                                    hide('#error');
                
                                    $scope.error = result.error;
                
                                    display('#error');
                                }
                            });
                        }
                    });
                }
            });
            
        }else{
            hide('#error');

            if( !$scope.city ){
                $scope.error = $scope.text.error.manualInsertion.CITY_IS_MISSING;
            }
            else if( !$scope.latitude ){
                $scope.error = $scope.text.error.manualInsertion.LATITUDE_IS_MISSING;
            }
            else if( !$scope.longitude ){
                $scope.error = $scope.text.error.manualInsertion.LONGITUDE_IS_MISSING;
            }
            else if( !$scope.period ){
                $scope.error = $scope.text.error.manualInsertion.PERIOD_IS_MISSING;
            }
            else if( !$scope.timeDivisionStart ){
                $scope.error = $scope.text.error.manualInsertion.TIME_DIVISION_START_IS_MISSING;
            }
            else if( !$scope.timeDivisionEnd ){
                $scope.error = $scope.text.error.manualInsertion.TIME_DIVISION_END_IS_MISSING;
            }
            else if( !$scope.granularity ){
                $scope.error = $scope.text.error.manualInsertion.GRANULARITY_IS_MISSING;
            }
            else if( !$scope.thresholdVehicule ){
                $scope.error = $scope.text.error.manualInsertion.CAR_THRESHOLD_IS_MISSING;
            }
            else if( !gridFile ){
                $scope.error = $scope.text.error.manualInsertion.GRID_FILE_IS_MISSING;
            }
            else if( !colorFile ){
                $scope.error = $scope.text.error.manualInsertion.COLOR_FILE_IS_MISSING;
            }

            display('#error');
        }
    };

});
