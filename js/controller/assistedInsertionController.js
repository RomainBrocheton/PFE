app.controller('assistedInsertionController', function( $scope, fileFactory, languageFactory ) {

    $scope.separationCharacter = DEFAULT_SEPARATION_CHARACTER;

    $scope.rawFile = false;
    $scope.multipleFiles = false;

    var infosFiles = [ "fileType", "city", "latitude", "longitude", "period", "granularity", "thresholdVehicule", "timeDivisionStart", "timeDivisionEnd", "direction" ];

    $scope.init = function(){

        languageFactory.setLanguage( $scope, document.getElementsByTagName("html")[0].lang, function(){
            
            $scope.fileFormat = {
                1  : { name : $scope.text.assistedInsertion.FILE_TYPE, value : $scope.text.assistedInsertion.GRID_OR_COLOR},
                2  : { name : $scope.text.assistedInsertion.CITY, value : $scope.text.global.ALPHABETICS_CHARACTERS_ONLY },
                3  : { name : $scope.text.assistedInsertion.LATITUDE, value : $scope.text.global.NUMBER_ONLY },
                4  : { name : $scope.text.assistedInsertion.LONGITUDE, value : $scope.text.global.NUMBER_ONLY },
                5  : { name : $scope.text.assistedInsertion.PERIOD, value : $scope.text.global.NUMBER_ONLY },
                6  : { name : $scope.text.assistedInsertion.GRANULARITY, value : $scope.text.global.NUMBER_ONLY },
                7  : { name : $scope.text.assistedInsertion.THRESHOLD_VEHICULE, value : $scope.text.global.NUMBER_ONLY },
                8  : { name : $scope.text.assistedInsertion.TIME_DIVISION_START, value : $scope.text.global.NUMBER_ONLY },
                9  : { name : $scope.text.assistedInsertion.TIME_DIVISION_END, value : $scope.text.global.NUMBER_ONLY },
                10 : { name : $scope.text.assistedInsertion.DIRECTION, value : $scope.text.global.BOOLEAN_ONLY }
            }
            
        } );
    }

    $scope.insert = function(){
        
        var gridFile = document.getElementById("gridFile" );
        var colorFile = document.getElementById( "colorFile" );

        if( $scope.multipleFiles ){
            var gridFile = document.getElementById( "pathGridFolder" );
            var colorFile = document.getElementById( "pathColorFolder" );
        }
        
        var pathRawFolder = document.getElementById( "pathRawFolder" );
        
        var rawFile = document.getElementById( "rawFile" );
        
        
        if( $scope.separationCharacter && ( 
          ( !$scope.rawFile &&  $scope.multipleFiles && pathGridFolder && pathGridFolder.files.length > 0 && pathColorFolder && pathColorFolder.files.length > 0 ) || 
          ( !$scope.rawFile && !$scope.multipleFiles && gridFile && gridFile.files.length > 0 && colorFile && colorFile.files.length > 0 ) ||
          (  $scope.rawFile &&  $scope.multipleFiles && pathRawFolder && pathRawFolder.files.length > 0 ) ||
          (  $scope.rawFile && !$scope.multipleFiles && rawFile && rawFile.files.length > 0 ) ) ){


            if( $scope.rawFile ){

                for( var fileNumber = 0 ; fileNumber < rawFile.files.length ; fileNumber = fileNumber + 1 ){
                    
                    rawFileTreatment( rawFile.files[ fileNumber ], function(){
                   
                    } );
                }

            }else {

                if( gridFile.files.length == colorFile.files.length ){
                    for( var fileNumber = 0 ; fileNumber < gridFile.files.length ; fileNumber = fileNumber + 1 ){
                        gridColorFilesTreatment( gridFile.files[ fileNumber ], colorFile.files[ fileNumber ], function(){

                        } );
                    }
                }else{
                    hide('#error');
                    $scope.error = $scope.text.error.assistedInsertion.NUMBER_OF_FILES;
                    display('#error');
                }
                
            }

        }else{
            hide('#error');

            if( !$scope.separationCharacter ){
                $scope.error = $scope.text.error.assistedInsertion.SEPARATOR_CHARATER_IS_MISSING + "'" + DEFAULT_SEPARATION_CHARACTER + "'";
                $scope.separationCharacter= DEFAULT_SEPARATION_CHARACTER;
            }
            else if( !$scope.rawFile && $scope.multipleFiles && ( !pathGridFolder || pathGridFolder.files.length < 1 ) ){
                $scope.error = $scope.text.error.assistedInsertion.GRID_FOLDER_IS_MISSING;
            }
            else if( !$scope.rawFile && $scope.multipleFiles && ( !pathColorFolder || pathColorFolder.files.length < 1 ) ){
                $scope.error = $scope.text.error.assistedInsertion.COLOR_FOLDER_IS_MISSING;
            }
            else if( !$scope.rawFile && !$scope.multipleFiles && ( !gridFile || gridFile.files.length < 1 ) ){
                $scope.error = $scope.text.error.assistedInsertion.GRID_FILE_IS_MISSING;
            }
            else if( !$scope.rawFile && !$scope.multipleFiles && ( !colorFile || colorFile.files.length < 1 ) ){
                $scope.error = $scope.text.error.assistedInsertion.COLOR_FILE_IS_MISSING;
            }
            else if( $scope.rawFile && $scope.multipleFiles && ( !pathRawFolder || pathRawFolder.files.length < 1 ) ){
                $scope.error = $scope.text.error.assistedInsertion.RAW_FOLDER_IS_MISSING;
            }
            else if( $scope.rawFile && !$scope.multipleFiles && ( !rawFile || rawFile.files.length < 1 ) ){
                $scope.error = $scope.text.error.assistedInsertion.RAW_FILE_IS_MISSING;
            }

            display('#error');
        }
    };

    function getInformationFromFilename( fileName, cb ){

        var fileInfos = fileName.split( $scope.separationCharacter );
    
        var fileType = fileInfos[ infosFiles.indexOf( "fileType" ) ];
        var city = fileInfos[ infosFiles.indexOf( "city" ) ];
        var latitude = fileInfos[ infosFiles.indexOf( "latitude" ) ];
        var longitude = fileInfos[ infosFiles.indexOf( "longitude" ) ];
        var period = fileInfos[ infosFiles.indexOf( "period" ) ];
        var granularity = fileInfos[ infosFiles.indexOf( "granularity" ) ];
        var thresholdVehicule = fileInfos[ infosFiles.indexOf( "thresholdVehicule" ) ];
        var timeDivisionStart = fileInfos[ infosFiles.indexOf( "timeDivisionStart" ) ];
        var timeDivisionEnd = fileInfos[ infosFiles.indexOf( "timeDivisionEnd" ) ];
        var direction = fileInfos[ infosFiles.indexOf( "direction" ) ];
        if( direction ) direction = direction.split( "." )[0];
        
        if( !fileType || !city || !latitude || !longitude || !period || !granularity || !thresholdVehicule || !timeDivisionStart || !timeDivisionEnd || !direction ){
            fileType = false;
        }

        cb( fileType, city, latitude, longitude, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction );
    }

    function rawFileTreatment( rawFile, cb ){

        readFile( rawFile, function( fileName, lines ){
        
            if( lines.length == 0 ){
                hide('#error');
    
                $scope.error = $scope.text.error.assistedInsertion.EMPTY_COLOR_FILE;

                display('#error');
                cb();
            } else {

                fileFactory.insertRawFile( lines, function( result ){
    
                    if( result.success ){
    
                        $("#controlPanel").animate({ scrollTop: 0 }, "slow");
    
                        hide('#success');
    
                        $scope.success = $scope.text.success.assistedInsertion.SUCCESSFUL_INSERTION;
                        
                        display('#success');
    
                    }else{
                        hide('#error');
    
                        $scope.error = result.error;
    
                        display('#error');
                    }

                    cb();
                });
            }
        });
    }

    function gridColorFilesTreatment( gridFile, colorFile, cb ){

        readFile( gridFile, function( gridFilename, gridFileLines ){

            if( gridFileLines.length == 0 ){
                hide('#error');
            
                $scope.error = $scope.text.error.assistedInsertion.EMPTY_GRID_FILE;

                display('#error');
                cb();
            } else {

                readFile( colorFile, function( colorFilename, colorFileLines ){
        
                    if( colorFileLines.length == 0 ){
                        hide('#error');
            
                        $scope.error = $scope.text.error.assistedInsertion.EMPTY_COLOR_FILE;
    
                        display('#error');
                        cb();
                    } else {
            
                        getInformationFromFilename( gridFilename, function( fileType, city, latitude, longitude, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction ){

                            if( fileType && fileType.toUpperCase() == "GRID" ){

                                getInformationFromFilename( colorFilename, function( fileType2, city2, latitude2, longitude2, period2, granularity2, thresholdVehicule2, timeDivisionStart2, timeDivisionEnd2, direction2 ){
                                
                                    if( fileType2 && fileType2.toUpperCase() == "COLOR" ){

                                        if( city != city2 && latitude != latitude2 && longitude != longitude2 && period != period2 && granularity != granularity2 && thresholdVehicule != thresholdVehicule2 && timeDivisionStart != timeDivisionStart2 && timeDivisionEnd != timeDivisionEnd2 && direction != direction2  ){
                                            hide('#error');
                            
                                            $scope.error = $scope.text.error.assistedInsertion.GRID_FILE_AND_COLOR_FILE_NOT_COMPATIBLE;
                        
                                            display('#error');
                                            cb();
                                        }else{
                                            fileFactory.insertFiles( city, latitude, longitude, period, granularity, thresholdVehicule, timeDivisionStart, timeDivisionEnd, direction, gridFileLines, colorFileLines, function( result ){
                
                                                if( result.success ){
                                
                                                    $("#controlPanel").animate({ scrollTop: 0 }, "slow");
                                
                                                    hide('#success');
                                
                                                    $scope.success = $scope.text.success.assistedInsertion.SUCCESSFUL_INSERTION;
                                                    
                                                    display('#success');
                                
                                                }else{
                                                    hide('#error');
                                
                                                    $scope.error = result.error;
                                
                                                    display('#error');
                                                }

                                                cb();
                                            });
                                        }
                                    }else{
                                        hide('#error');
                            
                                        $scope.error = $scope.text.error.assistedInsertion.BAD_COLOR_FILE_FORMAT;
                    
                                        display('#error');

                                        cb();
                                    }

                                    
                                });
                                
                            }else{
                                hide('#error');
                    
                                $scope.error = $scope.text.error.assistedInsertion.BAD_GRID_FILE_FORMAT;
            
                                display('#error');

                                cb();
                            }
                            
                        });
                    }
                });
            }
        });
    }

});