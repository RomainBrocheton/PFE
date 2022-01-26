# Traffic - PFE
> Polytech Marseille, INFO 5A

Ce projet de fin d'étude permet de visualiser sur une carte l'évolution du traffic sur une localisation. Les données ont été receueillies grâce aux GPS des taxis.

Les équipes ayant travaillé sur ce projet sont :
* 2019 : 
    * BRUNEAU Florian, 
    * ROSSAT Dorian, 
    * EVEN François
* 2022 : 
    * BROCHETON Romain
    * POINT Valentin


## Installation générale
Pour pouvoir exécuter le projet, il est nécessaire d'avoir [NodeJS](https://nodejs.org/en/) installé sur votre machine.  
Vous devez ensuite installer les différentes dépendances du projet. Pour se faire, merci d'éxecuter ces commandes :

```
npm install
cd front && npm install
cd ../server && npm install
```

### Base de données
Nous utilisons MongoDB comme serveur de base de données. Pour des raisons pratiques, nous avons décidé d'utiliser un serveur cloud (afin de partager plus facilement les informations de celle-ci d'une machine à une autre). 

Pour faire de même, il vous suffira de créer un compte sur [MongoDB Cloud](https://cloud.mongodb.com/) et de créer un projet. Vous pourrez ensuite dans la section `Databases` récupérer les informations de connexion à votre cluster en cliquant sur le bouton `Connect` puis `Connect your application`. Vous trouverez ensuite l'URL de connexion à insérer au bon endroit dans le code du serveur.

## Utilisation normale
Pour lancer l'application, merci d'éxecuter cette commande afin de lancer l'API :
```
node ./server/rest.js
```

L'application est ensuite accessible depuis votre navigateur à l'adresse `{path}/front/dist/index.html`.
L'API est accessible à l'adresse `localhost:8080`.

## Développement
### Installation supplémentaire
Pour le développement, vous devez également installer le CLI d'Angular : `ng`. Pour effectuer cette installation, merci d'éxecuter cette commande :
```
npm install -g @angular/cli
```

### Lancement
Pour lancer l'application pour le développement, merci d'éxecuter ces commandes dans deux terminaux différents :
```
node ./server/rest.js
ng serve --open
```

L'application est ensuite accessible depuis votre navigateur à l'adresse `localhost:4200`.
L'API est accessible à l'adresse `localhost:8080`.

### Build
Pour écraser le répertoire `dist` dans le but d'une utilisation normale, il vous suffira d'éxecuter la commande :
```
ng build
```

## Technologies utilisées
| Technologie     	| Version 	| Documentation                                 	|
|-----------------	|---------	|-----------------------------------------------	|
| NodeJS          	|   14.16 	| https://nodejs.org/docs/latest-v14.x/api/     	|
| MongoDB         	|  4.4.11 	| https://docs.mongodb.com/                     	|
| Angular         	|  12.0.2 	| https://angular.io/                           	|
| Open Street Map 	|         	| https://wiki.openstreetmap.org/wiki/Main_Page 	|
| Leaflet         	|   1.7.1 	| https://leafletjs.com                         	|