# Traffic - PFE

Traffic est un projet de fin d'étude. Il permet de visualiser sur une carte l'évolution du traffic sur une localisation. Les données ont été receueillies grâce aux GPS des taxis.

Les équipes ayant travaillé sur ce projet sont :
* 2019 : 
    * BRUNEAU Florian, 
    * ROSSAT Dorian, 
    * EVEN François
* 2021 : 
    * BROCHETON Romain
    * POINT Valentin 

## Modifications

L'équipe 2021 a travaillé sur le projet de 2019 dans un but d'amélioration de celui-ci. Vous pouvez retrouver le projet à son état de 2019 au premier commit de l'application.

Les modifications de 2021 ont portées sur :
* Refonte complète de l'UI/UX ;
* Transfert de Google Maps vers Open Street Map ;
* Passage sous Docker ;
* Purge des dépendances non utilisées ;
* Refonte de la documentation.

## Documentation
La documentation a été écrite avec [Docsify](https://docsify.js.org/). Pour la lancer en mode développeur, il vous suffit d'installer le CLI et de lancer le serveur : 
```
npm i docsify-cli -g
docsify serve
```

## Lancement rapide
Il est nécessaire d'installer en amont :
* [Docker](https://www.docker.com/) ;
* [NodeJS](https://nodejs.org/en/download/)

Une fois ces logiciels installés, merci d'exécuter ces commandes afin d'installer les modules nécessaires :
```
cd front && npm install
cd ../server && npm install
```

Dans le fichier `docker-compose.yml`, renseignez l'adresse de la base de données Mongo DB dans les variables d'environnement de l'image

Pour lancer l'application, il vous suffit de construire les images Docker et de lancer le container :
```
docker compose up --build
```

Une fois lancé, l'interface utilisateur sera accessible à l'adresse http://localhost tandis que l'API sera accessible à l'adresse http://localhost:8080.