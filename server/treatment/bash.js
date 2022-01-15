var shell = require('shelljs');

module.exports = {
    generateFiles : function( data, response ){

        // city, xmin, xmax, ymin, ymax, period, granularity, thresholdVehicle, timeDivisionStart, timeDivisionEnd, direction

        var rawFolder = "../data/raw/";
        var treatmentFolder = "../data/treatment/";

        var configFile = "../data/config.txt";

        var bashFile = "./treatment/bash/go_all.sh"

        //go_all.sh SanFranscico 116.202280  116.624936  39.801345   40.016152  12      0.06            3                   2               4           true        data/SanFrancisco/raw/      data/SanFrancisco/finish     data/config.txt       
        //          nom-ville    card_x_min  card_x_max  card_y_min  card_y_max periode granularité_km  thresholdVehicle    periode_debut   periode_fin direction   dossier_entrée_trajectoire  dossier_de_sortie            config_periode_de_temps  

        /*
        shell.exec( bashFile + ' ' + data.city + ' ' + data.xmin + ' ' + data.xmax + ' ' + data.ymin + ' ' + data.ymax + ' ' + data.period + ' ' + data.granularity + ' ' + data.thresholdVehicle +  ' ' + data.timeDivisionStart + ' ' + data.timeDivisionEnd + ' ' + data.direction + ' ' + rawFolder + ' ' + treatmentFolder + ' ' + configFile );

        response.send({
            success : true
        });
        */

    }
}