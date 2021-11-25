Ce repository est un mono repo. utilisant lerna.
Dans les packages vous trouverez : 
## auth-express-router
C'est un package contenant un server express et un routeur
## auth-module-types
C'est un package apportant tout le typing partagé entre les différents packages
## auth-http-client
C'est un package qui propose un client http basé sur axios pour consommer l'api proposée par l'auth-express-router

# Pour développper les packages
Chaque pkg propose les scripts npm "build", "clean", "start" et "test"
```js
// On installe les dépendances
npm install
// lerna installe les dépendances dans chaques pkg
lerna bootrap
// link les dépendances entre elles
lerna link
```

De là il est possible de lancer les commandes de chaque pkg depuis lerna
```js
// Par example, cette commande effectue dans chaque pkg la commande clean
lerna run clean
// ou
npm run clean
```

Une fois la librairie modifiée, il est necessaire de build les pkgs
```js
lerna run build
// ou
npm run build
```
