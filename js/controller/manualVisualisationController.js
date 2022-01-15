app.controller('manualVisualisationController', function( $scope, languageFactory, languageFactory ) {

    $scope.informationsIsDiplayOnMap = false;

    $scope.init = function(){
        languageFactory.setLanguage( $scope, document.getElementsByTagName("html")[0].lang, function(){
        });
    }
    
    $scope.clearMap = function(){

        clearMap();

        $scope.informationsIsDiplayOnMap = false;

    }

    $scope.display = function( gridFile, colorFile ){

        if( $scope.newLatitude && $scope.newLongitude && document.getElementById( gridFile ).files[0] && document.getElementById( colorFile ).files[0] ){
            
            $scope.displayManualVisualisation( gridFile, colorFile );

            $scope.informationsIsDiplayOnMap = true;

        }else{

            hide('#error');

            if( !$scope.newLatitude ){

                $scope.error = $scope.text.error.manualVisualisation.LATITUDE_IS_MISSING;

            }else if( !$scope.newLongitude ){

                $scope.error = $scope.text.error.manualVisualisation.LONGITUDE_IS_MISSING;
                
            }else if( !document.getElementById( gridFile ).files[0] ){

                $scope.error = $scope.text.error.manualVisualisation.GRID_FILE_IS_MISSING;
                
            }else if( !document.getElementById( colorFile ).files[0] ){

                $scope.error = $scope.text.error.manualVisualisation.COLOR_FILE_IS_MISSING;
                
            }

            display('#error');

        }

    }

    $scope.displayManualVisualisation = function( gridFileId, colorFileId ){

        clearMap();

		readFile( document.getElementById( gridFileId ).files[0], function( fileNameGrid, gridLines ){
            
            readFile( document.getElementById( colorFileId ).files[0], function( fileNameColor, colorLines ){
                
                console.log( colorLines );

                if( colorLines[0].includes(":") ){
                    areaTraitementSeq(gridLines, function(){
                        areaColorTraitementSeq(colorLines, function(){

                        });
                    });
                }else{
                    areaTraitement(gridLines, function(){
                        areaColorTraitement( colorLines, function(){

                        });
                    });
                }						
            });
		});
    }
    
});
