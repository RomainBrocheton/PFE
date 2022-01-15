app.controller('assistedVisualisationController', function( $scope, dataFactory, fileFactory, languageFactory ) {

    $scope.nbMaxParamRadio = 3;

    $scope.init = function(){
        clearMap();

        $scope.cityAvailable();

        languageFactory.setLanguage( $scope, document.getElementsByTagName("html")[0].lang, function(){

        });
    }

    $scope.setLocation = function( city ){

        dataFactory.getLocation( city, function( longitude, latitude ) {
            $scope.longitude = longitude;
            $scope.latitude = latitude;

            initMap( parseFloat( longitude.replace(",", ".") ), parseFloat( latitude.replace(",", ".") ) );      
        });
    }
    
    $scope.cityAvailable = function(){
        $scope.cities = undefined;

        dataFactory.getCityAvailable( function( cities ) {
           $scope.cities = cities;
        });
   };

   $scope.periodAvailable = function(){
        $scope.citySelected = false;
        $scope.periodSelected = false;
        $scope.granularitySelected = false;
        $scope.thresholdVehiculeSelected = false;
        $scope.timeDivisionStartSelected = false;
        $scope.timeDivisionEndSelected = false;
        $scope.directionSelected = false;
    
        clearMap();
        $scope.periods = undefined;

        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        periodSelector = document.querySelector('input[name=period]:checked');
        granularitySelector = document.querySelector('input[name=granularity]:checked');        

        if( citySelector ){

            $scope.citySelected = citySelector.value;
            this.setLocation( citySelector.value );

            dataFactory.getPeriodAvailable( citySelector.value, function( periods ) {
                $scope.periods = periods;
            });
       }
   };

   $scope.granularityAvailable = function(){

        $scope.periodSelected = false;
        $scope.granularitySelected = false;
        $scope.thresholdVehiculeSelected = false;
        $scope.timeDivisionStartSelected = false;
        $scope.timeDivisionEndSelected = false;
        $scope.directionSelected = false;

        clearMap();
        $scope.granularities = undefined;
        
        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        granularitySelector = document.querySelector('input[name=granularity]:checked');

        if( citySelector && periodSelector ){
            
            $scope.periodSelected = periodSelector.value;
            
            dataFactory.getGranularityAvailable( citySelector.value, periodSelector.value, function( granularities ) {
                $scope.granularities = granularities;
            });
       }
    };

    $scope.thresholdVehiculeAvailable = function(){
    
        $scope.granularitySelected = false;
        $scope.thresholdVehiculeSelected = false;
        $scope.timeDivisionStartSelected = false;
        $scope.timeDivisionEndSelected = false;
        $scope.directionSelected = false;

        clearMap();
        $scope.thresholdVehicule = undefined;
        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked');

        if( citySelector && periodSelector && granularitySelector ){
            
            $scope.granularitySelected = granularitySelector.value;
            
            dataFactory.getThresholdVehiculeAvailable( citySelector.value, periodSelector.value, granularitySelector.value, function( thresholdVehicule ) {
                $scope.thresholdVehicules = thresholdVehicule;
            });
    }
    };

    $scope.timeDivisionStartAvailable = function(){

        $scope.thresholdVehiculeSelected = false;
        $scope.timeDivisionStartSelected = false;
        $scope.timeDivisionEndSelected = false;
        $scope.directionSelected = false;

        clearMap();
        $scope.timeDivisionStarts = undefined;
        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        if( document.getElementById("thresholdVehicule").value === undefined ? thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked') : thresholdVehiculeSelector = document.getElementById("thresholdVehicule"));
        timeDivisionStartSelector = document.querySelector('input[name=timeDivisionStart]:checked');

        if( citySelector && periodSelector && granularitySelector && thresholdVehiculeSelector ){
                
            $scope.thresholdVehiculeSelected = thresholdVehiculeSelector.value;
                
            dataFactory.getTimeDivisionStartAvailable( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, function( timeDivisionStarts ) {
                $scope.timeDivisionStarts = timeDivisionStarts;
            });
        }
    };

    $scope.timeDivisionEndAvailable = function(){

        $scope.timeDivisionStartSelected = false;
        $scope.timeDivisionEndSelected = false;
        $scope.directionSelected = false;

        clearMap();
        $scope.timeDivisionEnds = undefined;
        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        if( document.getElementById("thresholdVehicule").value === undefined ? thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked') : thresholdVehiculeSelector = document.getElementById("thresholdVehicule"));
        if( document.getElementById("timeDivisionStart").value === undefined ? timeDivisionStartSelector = document.querySelector('input[name=timeDivisionStart]:checked') : timeDivisionStartSelector = document.getElementById("timeDivisionStart"));
        timeDivisionEndSelector = document.querySelector('input[name=timeDivisionEnd]:checked');
       
        if( citySelector && periodSelector && granularitySelector && thresholdVehiculeSelector && timeDivisionStartSelector ){
                
                $scope.timeDivisionStartSelected= timeDivisionStartSelector.value;
                
                dataFactory.getTimeDivisionEndAvailable( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, function( timeDivisionEnds ) {
                    $scope.timeDivisionEnds = timeDivisionEnds;
                });
        }
    };

    $scope.directionAvailable = function(){
        
        $scope.timeDivisionEndSelected = false;
        $scope.directionSelected = false;

        clearMap();
        $scope.directions = undefined;
        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        if( document.getElementById("thresholdVehicule").value === undefined ? thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked') : thresholdVehiculeSelector = document.getElementById("thresholdVehicule"));
        if( document.getElementById("timeDivisionStart").value === undefined ? timeDivisionStartSelector = document.querySelector('input[name=timeDivisionStart]:checked') : timeDivisionStartSelector = document.getElementById("timeDivisionStart"));
        if( document.getElementById("timeDivisionEnd").value === undefined ? timeDivisionEndSelector = document.querySelector('input[name=timeDivisionEnd]:checked') : timeDivisionEndSelector = document.getElementById("timeDivisionEnd"));
        directionSelector = document.querySelector('input[name=direction]:checked');
       
        if( citySelector && periodSelector && granularitySelector && thresholdVehiculeSelector && timeDivisionStartSelector && timeDivisionEndSelector ){
                
            $scope.timeDivisionEndSelected = timeDivisionEndSelector.value;
               
            dataFactory.getDirectionAvailable( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, timeDivisionEndSelector.value, function( direction ) {
                $scope.directions = direction;
            });
        }
    };

    $scope.authorAvailable = function(){

        $scope.directionSelected = false;

        clearMap();
        $scope.authors = undefined;
        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        if( document.getElementById("thresholdVehicule").value === undefined ? thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked') : thresholdVehiculeSelector = document.getElementById("thresholdVehicule"));
        if( document.getElementById("timeDivisionStart").value === undefined ? timeDivisionStartSelector = document.querySelector('input[name=timeDivisionStart]:checked') : timeDivisionStartSelector = document.getElementById("timeDivisionStart"));
        if( document.getElementById("timeDivisionEnd").value === undefined ? timeDivisionEndSelector = document.querySelector('input[name=timeDivisionEnd]:checked') : timeDivisionEndSelector = document.getElementById("timeDivisionEnd"));
        if( document.getElementById("direction").value === undefined ? directionSelector = document.querySelector('input[name=direction]:checked') : directionSelector = document.getElementById("direction"));
        authorSelector = document.querySelector('input[name=author]:checked');

        if( citySelector && periodSelector && granularitySelector && thresholdVehiculeSelector && directionSelector && timeDivisionStartSelector){
                
            $scope.directionSelected = directionSelector.value;
                
            dataFactory.getAuthorAvailable( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, timeDivisionEndSelector.value, directionSelector.value, function( authors ) {
                $scope.authors = authors;
            });
        }
    };

    $scope.getFiles = function(){

        $scope.authorSelected = true;

        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        if( document.getElementById("thresholdVehicule").value === undefined ? thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked') : thresholdVehiculeSelector = document.getElementById("thresholdVehicule"));
        if( document.getElementById("timeDivisionStart").value === undefined ? timeDivisionStartSelector = document.querySelector('input[name=timeDivisionStart]:checked') : timeDivisionStartSelector = document.getElementById("timeDivisionStart"));
        if( document.getElementById("timeDivisionEnd").value === undefined ? timeDivisionEndSelector = document.querySelector('input[name=timeDivisionEnd]:checked') : timeDivisionEndSelector = document.getElementById("timeDivisionEnd"));
        if( document.getElementById("direction").value === undefined ? directionSelector = document.querySelector('input[name=direction]:checked') : directionSelector = document.getElementById("direction"));
        if( document.getElementById("author").value === undefined ? authorSelector = document.querySelector('input[name=author]:checked') : authorSelector = document.getElementById("author"));

        if( citySelector && periodSelector && granularitySelector && directionSelector && thresholdVehiculeSelector && timeDivisionStartSelector && authorSelector ){

            $scope.error = '';
            $scope.loading = 0;
            $scope.loadingInfo = $scope.text.assistedVisualisation.CLEAR_THE_MAP;

            clearMap();
            $scope.loading = 20;
            $scope.loadingInfo = $scope.text.assistedVisualisation.GET_GRID_FILE_INFO;
            
            fileFactory.getGridFile( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, timeDivisionEndSelector.value, directionSelector.value, authorSelector.value, function( gridFileLines ) {

                $scope.loading = 40;
                $scope.loadingInfo = $scope.text.assistedVisualisation.GET_COLOR_FILE_INFO;

                fileFactory.getColorFile( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, timeDivisionEndSelector.value, directionSelector.value, authorSelector.value, function( colorFileLines ) {
                    
                    if( gridFileLines.lines.length < 1 ){
                        hide('#error');
                        $scope.error = $scope.text.error.assistedVisualisation.GRID_FILE_EMPTY;
                        display('#error');
                    }
                    
                    if( directionSelector.value == "true" ){
                        
                        $scope.loading = 60;
                        $scope.loadingInfo = $scope.text.assistedVisualisation.GRID_FILE_TREATMENT;

                        areaTraitementSeq(gridFileLines.lines, function(){
                            
                            $scope.loading = 80;
                            $scope.loadingInfo = $scope.text.assistedVisualisation.COLOR_FILE_TREATMENT;

                            if( !$scope.error && colorFileLines.length < 1 ){
                                hide('#error');
                                $scope.error = $scope.text.error.assistedVisualisation.COLOR_FILE_EMPTY;
                                display('#error');
                            }else{
                                areaColorTraitementSeq(colorFileLines, function(){
                                    $scope.loading = 100;
                                });
                            }
                        });
                    }else {
                        
                        areaTraitement( gridFileLines.lines, function(){

                            $scope.loading = 60;
                            $scope.loadingInfo = $scope.text.assistedVisualisation.COLOR_FILE_TREATMENT;

                            if( !$scope.error && colorFileLines.length < 1 ){
                                hide('#error');
                                $scope.error = $scope.text.error.assistedVisualisation.COLOR_FILE_EMPTY;
                                display('#error');
                            }else{
                                areaColorTraitement( colorFileLines, function(){

                                    $scope.loading = 100;
                                });
                            }
                        });
                    }
                });
            });

            dataFactory.isMyfile( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, timeDivisionEndSelector.value, directionSelector.value, function( result ){
                $scope.isMyfile = result;
            });
        }
    };

    $scope.deleteFiles = function(){

        if( document.getElementById("city").value === undefined ? citySelector = document.querySelector('input[name=city]:checked') : citySelector = document.getElementById("city") );
        if( document.getElementById("period").value === undefined ? periodSelector = document.querySelector('input[name=period]:checked') : periodSelector = document.getElementById("period"));
        if( document.getElementById("granularity").value === undefined ? granularitySelector = document.querySelector('input[name=granularity]:checked') : granularitySelector = document.getElementById("granularity"));
        if( document.getElementById("thresholdVehicule").value === undefined ? thresholdVehiculeSelector = document.querySelector('input[name=thresholdVehicule]:checked') : thresholdVehiculeSelector = document.getElementById("thresholdVehicule"));
        if( document.getElementById("timeDivisionStart").value === undefined ? timeDivisionStartSelector = document.querySelector('input[name=timeDivisionStart]:checked') : timeDivisionStartSelector = document.getElementById("timeDivisionStart"));
        if( document.getElementById("timeDivisionEnd").value === undefined ? timeDivisionEndSelector = document.querySelector('input[name=timeDivisionEnd]:checked') : timeDivisionEndSelector = document.getElementById("timeDivisionEnd"));
        if( document.getElementById("direction").value === undefined ? directionSelector = document.querySelector('input[name=direction]:checked') : directionSelector = document.getElementById("direction"));
        if( document.getElementById("author").value === undefined ? authorSelector = document.querySelector('input[name=author]:checked') : authorSelector = document.getElementById("author"));

        if( citySelector && periodSelector && granularitySelector && thresholdVehiculeSelector && directionSelector && timeDivisionStartSelector && authorSelector){

            fileFactory.deleteFiles( citySelector.value, periodSelector.value, granularitySelector.value, thresholdVehiculeSelector.value, timeDivisionStartSelector.value, timeDivisionEndSelector.value, directionSelector.value, authorSelector.value, function( result ) {
                
                clearMap();
                document.location.reload(true);
            });
        }
    };
});
