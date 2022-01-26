//---------- Serveur Init ----------
var { port } = require('./config');
var port = port || 8080;
var configDirectory = 'server';
var viewsDirectory = './';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var miscellaneous = require('./treatment/miscellaneous');
var database = require('./database/mongo');


//---------- Serveur Start ----------

var app = express();

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

//init parser with express
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//authorize access to public directory to server html, css, js, ...
app.use( express.static( path.join( __dirname.substring( 0, __dirname.length-configDirectory.length ), viewsDirectory ) ) );

app.listen(port);

var bash = require('./treatment/bash');
bash.generateFiles();

// ------------  USER_TOKEN  ------------

function verifyUserToken( token, cb ){
    
    jwt.verify( token, miscellaneous.userTokenKey, function( error, data ){

        if( error ){
            cb( false );
        } else {
            cb( data );
        }
    });

}

app.post('/userTokenOk', function( requete, response ) {

    requete = requete.body;
  
    verifyUserToken( requete.token, function( data ){

        if( data ){
            response.send( 
                {
                    success : true
                }  
            );
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                } 
            );
        }
    } );

} );

// ------------  PARAMETER AVAILABLE  ------------

var parameterAvailable = require('./treatment/parameterAvailable');

app.post('/getLocation', function( requete , response ) {

    requete = requete.body;
    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getLocation(requete.city, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );
    
});

app.post('/getCityAvailable', function( requete , response ) {

    requete = requete.body;
    
    verifyUserToken( requete.token, function( data ){
        if( data && data.email ){
            parameterAvailable.getCityAvailable( response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );
    
});

app.post('/getCities', function( requete , response ) {
    database.getDataModel().find({}, function(err, res){
        response.send( 
            {
                success : true,
                cities : res
            }
        );
    });
});

app.post('/getPeriodAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getPeriodAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

    
});

app.post('/getGranularityAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getGranularityAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/getThresholdVehiculeAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getThresholdVehiculeAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/getDirectionAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getDirectionAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/getTimeDivisionStartAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getTimeDivisionStartAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/getTimeDivisionEndAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getTimeDivisionEndAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/getAuthorAvailable', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            parameterAvailable.getAuthorAvailable(requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

// ------------  FILES  ------------

var files = require('./treatment/files');

app.post('/getGridFile', function( requete , response ) {

    requete = requete.body; 

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){

            files.getGridFile(data.email, requete.data, response);
           
        }else{

            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/getColorFile', function( requete , response ) {

    requete = requete.body; 

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            files.getColorFile(data.email, requete.data, response);
           
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/isMyFile', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            files.isMyFile( requete.data, data.email, response );
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/insertFiles', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){

            files.doesExist( data.email, requete.data, function(exist){
                if(exist){
                    files.insertFiles( data.email, requete.data, response);
                }else{
                    response.send( 
                    {
                        success : false,
                        error : "You have already upload this file"
                    }
                );
                }
            });
       
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

var bash = require('./treatment/bash');

app.post('/insertRawFile', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){

            bash.generateFiles( requete.data, response );
       
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

app.post('/deleteFiles', function( requete , response ) {

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            files.deleteFiles(data.email, requete.data, response);
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

// ------------  CONNECTION  ------------

var connection = require('./treatment/connection');

app.post('/register', function( requete, response ) {

    requete = requete.body;

    connection.register( requete.email, requete.password, response );

});

app.post('/login', function( requete , response ){

    requete = requete.body;

    connection.login( requete.email, requete.password, response );

});

// ------------  PERMISSION  ------------

app.post('/getPermission', function( requete , response ){

    requete = requete.body;

    verifyUserToken( requete.token, function( data ){

        if( data && data.email ){
            response.send(
                {
                    success : true,
                    message : "you're logged"
                }
            );
        }else{
            response.send( 
                {
                    success : false,
                    error : "You are not connected"
                }
            );
        }
    } );

});

console.log('Serveur running on port ' + port );