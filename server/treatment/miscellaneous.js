
module.exports = {

    // Le "grain de sel" utilisé pour hasher les mot de passe en base de données
    salt : 'do?pùa29jhd:iuza09jéç45àpîpdml3x^éçx,é^pdù',

    // Le "grain de sel" utilisé pour la génération des tokens user
    userTokenKey : 'D%M2àE8dzUDJM+/D°Z92S2Nxe30àoe33@&',

    dataPath : "data/",
    temporaryFolder: "temporary/",

    getSalt(){
        return this.salt;
    },

    getUserTokenKey(){
        return this.userTokenKey;
    },

    getDataPath(){
        return this.dataPath;
    },

    getTemporaryFolder(){
        return this.temporaryFolder;
    }
}