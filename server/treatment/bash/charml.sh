#!/bin/sh

#CONTEXT="exempleLattice.lmb"
DATAFILE=$1 #"exemple.txt"
MINSUP=$2

#CLASSPATH=.:./jdom-1.1.jar:./LatticeMiner-1.4.jar:./latticeminertoolsND.jar:$CLASSPATH

#convertion des donnees au format exact de charml
java -cp FormatCharm $DATAFILE 

#lancement de charml
./treatment/bash/charml -S $MINSUP -i $DATAFILE.ascii -o $DATAFILE.ascii.$MINSUP.txt

