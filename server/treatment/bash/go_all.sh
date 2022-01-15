#!/bin/sh

# RESSOURCES

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

# INIT

actualPeriod=$PERIOD_START;

# TREATMENT 

while test $actualPeriod -lt $PERIOD_END
do

    # nextPeriod = actualPeriod + 1
    nextPeriod=`expr $actualPeriod + 1`; 

    # Execute same treatment on all
    ./treatment/bash/go_one.sh $CITY $CARD_X_MIN $CARD_X_MAX $CARD_Y_MIN $CARD_Y_MAX $PERIOD $GRANULARITY $THRESHOLD_VEHICLE $PERIOD_START $PERIOD_END $DIRECTION $DATAPATH_ENTRY $DATAPATH_EXIT $CONFIG_FILE &

    wait

    # actualPeriod = actualPeriod + 1
    i=`expr $actualPeriod + 1`; 
done

#stats

STATFILE=$DATAPATH_EXIT$CITY"_"$GRANULARITY"/"$CITY"_"$GRANULARITY"_"$PERIOD".stats";

rm -f $STATFILE

echo $DATAPATH_EXIT
mkdir -p $DATAPATH_EXIT;
mkdir -p $DATAPATH_EXIT$CITY"_"$GRANULARITY"/";
touch $STATFILE

echo "\\ begin{table}" >> $STATFILE;
echo "\\ begin{tabular}{|c|c|c|c|c|c|c|c|c|c|c|c|c|}" >> $STATFILE;
echo "\\hline" >> $STATFILE;
echo "City & Sp. gr. & Temp. gr. & Time windows & Transactions & Items & THRESHOLD_VEHICLE & Emerging & Decreasing & Latent & Lost & Jumping & Total \\ \\" >> $STATFILE;
echo "\\hline" >> $STATFILE;


i=$PERIOD_START;

while test $actualPeriod -lt $PERIOD_END
do

j=`expr $actualPeriod + 1`;

cat $DATAPATH_EXIT$CITY"_"$GRANULARITY"/"$CITY"_"$GRANULARITY"_"$PERIOD"_c"$actualPeriod"_c"$nextPeriod".data.data.ascii."$THRESHOLD_VEHICLE".txt.stats" >> $STATFILE

echo "\\hline" >> $STATFILE;

i=`expr $actualPeriod + 1`;

done

echo "\\end{tabular}" >> $STATFILE;
echo "\\ caption{$CITY, $GRANULARITY km, $PERIOD h, THRESHOLD_VEHICLE=$THRESHOLD_VEHICLE}" >> $STATFILE;
echo "\\end{table}" >> $STATFILE;