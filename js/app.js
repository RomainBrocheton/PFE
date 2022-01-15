var app = angular.module("traficVisualizer", ["ngRoute","ngResource"]);

/* --------------------------- GLOBAL VARIABLE --------------------------- */

var ASSISTED_VISUALISATION = '/assistedVisualisation';
var MANUAL_VISUALISATION = '/manualVisualisation';
var MANUAL_INSERTION = '/manualInsertion';
var ASSISTED_LOGIN = '/assistedInsertion';
var REGISTER = '/register';
var LOGIN = '/login';
var HOME = '/home';

var VIEWS_DIRECTORY = '../views/';

var DEFAULT_SEPARATION_CHARACTER = "_";

var ANIMATION_DELAY = 3000;
var ANIMATION_SLIDE_UP = 500;
var ANIMATION_SLIDE_DOWN = 500;

var LAST_MODIFICATION = "30/01/2019";

var HTML_VERSION = "5";
var ANGULAR_VERSION = "1.7.4";
var CSS_VERSION = "3";
var BOOTSTRAP_VERSION = "4.1.3";
var JQUERY_VERSION = "3.3.1";
var POPPER_VERSION = "1.14.3";
var JAVASCRIPT_VERSION = "9";
var NODE_JS_VERSION = "9.8";
var MONGO_DB_VERSION = "3.6.4";

/* --------------------------- ROUTING --------------------------- */

app.config( function($routeProvider) {
  $routeProvider
      .when( ASSISTED_VISUALISATION, {templateUrl : VIEWS_DIRECTORY + "assistedVisualisation.html", controller: "assistedVisualisationController"})
      .when( MANUAL_VISUALISATION, {templateUrl : VIEWS_DIRECTORY + "manualVisualisation.html", controller: "manualVisualisationController"})
      .when( MANUAL_INSERTION, {templateUrl : VIEWS_DIRECTORY + "manualInsertion.html", controller: "manualInsertionController"})
      .when( ASSISTED_LOGIN, {templateUrl : VIEWS_DIRECTORY + "assistedInsertion.html", controller: "assistedInsertionController"})
      .when( REGISTER, {templateUrl : VIEWS_DIRECTORY + "register.html", controller: "connectionController"})
      .when( LOGIN, {templateUrl : VIEWS_DIRECTORY + "login.html", controller: "connectionController"})
      .when( HOME, {templateUrl : VIEWS_DIRECTORY + "home.html", controller: "homeController"})
      .otherwise({redirectTo : MANUAL_VISUALISATION});
});

/* --------------------------- DISPLAY ERROR / SUCCESS MESSAGES --------------------------- */

hide = function( id ){
  $( id ).slideUp( ANIMATION_SLIDE_UP );
}

display = function( id ){

  if( $( id ).is(':hidden') ){
      $( id ).slideDown( ANIMATION_SLIDE_DOWN, function(){
          $( id ).delay( ANIMATION_DELAY ).slideUp( ANIMATION_SLIDE_UP );
      });
  }

}