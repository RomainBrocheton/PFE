app.controller('homeController', function( $scope, languageFactory ) {

    $scope.init = function(){
        languageFactory.setLanguage( $scope, document.getElementsByTagName("html")[0].lang, function(){
        });

        $scope.lastModification = LAST_MODIFICATION;
        
        $scope.htmlVersion = HTML_VERSION;
        $scope.angularJsVersion = ANGULAR_VERSION;
        $scope.cssVersion = CSS_VERSION;
        $scope.bootstrapVersion = BOOTSTRAP_VERSION;
        $scope.jqueryVersion = JQUERY_VERSION;
        $scope.popperVersion = POPPER_VERSION;
        $scope.javascriptVersion = JAVASCRIPT_VERSION;
        $scope.nodeJsVersion = NODE_JS_VERSION;
        $scope.mongoDbVersion = MONGO_DB_VERSION;
        
    }
});