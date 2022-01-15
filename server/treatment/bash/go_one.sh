#!/bin/sh

CHEMIN=`pwd`
export CLASSPATH=".:$CHEMIN/treatment/bash/traj2018.jar"


# ENTRY PARAMETERS

CITY=$1;
CARD_X_MIN=$2; 
CARD_X_MAX=$3;
CARD_Y_MIN=$4;
CARD_Y_MAX=$5;
PERIOD=$6;
GRANULARITY=$7;       # in KM
THRESHOLD_VEHICLE=$8; 
PERIOD_START=$9; 
PERIOD_END=${10}; 
DIRECTION=${11};      # TRAJECTORY OR NOT
DATAPATH_ENTRY=${12};
DATAPATH_EXIT=${13}; 
CONFIG_FILE=${14}; 

#Pekin
#116.202280; //x min (longitude)
#116.624936; //x max (longitude)
#39.801345; // y min (latitude)
#40.016152; // y max (latitude)

#Marseille
#5.363736; //x min (longitude)
#5.394843; //x max (longitude)
#43.284480; // y min (latitude)
#43.301605; // y max (latitude)	

#SanFrancisco
#-122.492833; //x min (longitude)
#-122.382982; //x max (longitude)
#37.748705; // y min (latitude)
#37.787374; // y max (latitude)

#examples
#./go_one.sh data/trajectories2/ data/config.txt Pekin 0.06 3 4 data/ 24 10 116.202280 116.624936 39.801345 40.016152
#./go_one.sh data/marseille/ data/config.txt Marseille 0.06 1 2 data/ 24 1 5.363736 5.394843 43.284480 43.301605
#./go_one.sh data/SanFrancisco1day/ data/configSF.txt SanFrancisco 0.06 2 3 data/ 24 80 -122.492833 -122.382982 37.748705 37.787374

#remarque : a executer depuis le dossier contenant "data"


#generation de la grille (complete), mapping des trajectoires 
#et enregistrement de la grille des cellules traversees
java -Xmx1024m main.MainComputeGrid $DATAPATH_ENTRY $CONFIG_FILE $CITY $GRANULARITY $PERIOD_START $PERIOD_END $CITY $DATAPATH_EXIT $CARD_X_MIN $CARD_X_MAX $CARD_Y_MIN $CARD_Y_MAX $PERIOD

#generation des fichiers de donnees pour l'extraction (avec renumerotation des items) -> ".data.data", ".data.data.items"
GRIDPATH=$DATAPATH_EXIT$CITY"_"$GRANULARITY"/"$CITY"_"$GRANULARITY"_"$PERIOD"_c"$PERIOD_START"_c"$PERIOD_END; #data/Pekin_0.06/grid_g0.06_24_c3_c4
java -Xmx1024m main.MainGenPatternDataFile $GRIDPATH

#extraction des concepts formels frequents -> "...ascii.THRESHOLD_VEHICLE.txt"
DATA=$GRIDPATH".data.data"; #data/Pekin_0.06/grid_g0.06_24_c3_c4.data.data
./treatment/bash/charml.sh $DATA $THRESHOLD_VEHICLE

#echo "rm -f $DATA.ascii.$THRESHOLD_VEHICLE.txt.xml";
#rm -f $DATA.ascii.$THRESHOLD_VEHICLE.txt.xml

rm -f summary.out

#detection des types / evolution des concepts frequents, et retour numerotation d'origine -> ".res"
RESULT=$DATA".ascii."$THRESHOLD_VEHICLE".txt";
ITEMSFILE=$DATA".items";
CLASSESFILE=$GRIDPATH".classes";
java -Xmx1024m main.DetectConceptTypes $RESULT $ITEMSFILE $CLASSESFILE


#generation des fichiers pour la visualisation -> "_grille.txt" et "_colortype.txt"
GRIDTRJ=$GRIDPATH"_grille_trj.txt"; #data/Pekin_0.06/grid_g0.06_24_c3_c4_grille_trj.txt
RES=$RESULT".res"; #data/Pekin_0.06/grid_g0.06_24_c3_c4.data.data.ascii.10.txt.res
java -Xmx1024m main.GenerateVisuOutputFiles $GRIDTRJ $RES



#stats
echo "calcul des stats";
STATS=$RESULT".stats";
NBTRANS=`cat $DATA | wc -l`;
NBITEMS=`cat $ITEMSFILE | wc -l`;
#THRESHOLD_VEHICLEABS=`expr ($THRESHOLD_VEHICLE \* $NBSEQUENCES) / 100`;
NBFC=`cat $RES | wc -l`;
NBEMERGING=`cat $RES | grep "EMERGING" | wc -l`;
NBDECREASING=`cat $RES | grep "DECREASING" | wc -l`;
NBLATENT=`cat $RES | grep "LATENT" | wc -l`;
NBJUMPING=`cat $RES | grep "JUMPING" | wc -l`;
NBLOST=`cat $RES | grep "LOST" | wc -l`;
DOUBLEBACKSLASH="\\ \\"; 
#echo "%City & Sp. gr & Temp. gr. & Time windows & #Transactions & #Items & THRESHOLD_VEHICLE & #Emerging & #Decreasing & #Latent & #Lost & #Jumping & #fc" > $STATS
echo "$CITY & $GRANULARITY & $PERIOD & ($PERIOD_START,$PERIOD_END) & $NBTRANS & $NBITEMS & $THRESHOLD_VEHICLE & $NBEMERGING & $NBDECREASING & $NBLATENT & $NBLOST & $NBJUMPING & $NBFC $DOUBLEBACKSLASH" >> $STATS




# compression de fichiers intermediaires
echo "compression des fichiers";

gzip -f $RESULT

DATASCII=$DATA".ascii";

gzip -f $DATASCII

gzip -f $DATA

DATAD=$GRIDPATH".data";

gzip -f $DATAD

gzip -f $ITEMSFILE

gzip -f $CLASSESFILE

gzip -f $RES

gzip -f $GRIDPATH

IDS=$GRIDPATH".ids"

gzip -f $IDS

GRIDTRJ=$GRIDPATH"_grille_trj.txt"

gzip -f $GRIDTRJ

