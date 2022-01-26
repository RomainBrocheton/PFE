//---------- Mongo Init ----------

var mongoose = require('mongoose');
var { mongoUrl } = require('../config');
// ---------- Connection ----------

mongoose.connect(mongoUrl, function( error ){
    if( error ) {
        throw error; 
    } else {
        console.log('Connection with mongo initialized');
    }
});

// ---------- Schemas ----------

var DataSchema = mongoose.Schema({
    _id: String,
    city : String,
    longitude : String,
    latitude : String,
    period : String,
    granularity : String,
    thresholdVehicule : String,
    direction : String,
    timeDivisionStart : String,
    timeDivisionEnd : String,
    file_grille : String,
    file_color : String,
    author : String
}, {
    versionKey: false
});

const ObjectId = mongoose.Schema.Types.ObjectId;

var chunkSchema = mongoose.Schema({
    _id: ObjectId,
    files_id : ObjectId,
    n : String,
    data : String
}, {
    versionKey: false
});

var fileSchema = mongoose.Schema({
    _id: ObjectId,
    filename : String,
    metadata : String,
    data : String,
    n : String
}, {
    versionKey: false
});

var userSchema = mongoose.Schema({
    _id: String,
    email : String,
    password : String,
}, {
    versionKey: false
});

//---------- Mongo ----------

var dataModel = mongoose.model('dataModel', DataSchema);
var chunkModel = mongoose.model('fs.chunks', chunkSchema);
var fileModel = mongoose.model('fs.files', fileSchema );
var userModel = mongoose.model( 'users', userSchema );

module.exports = {

    getDataModel: function(){
        return dataModel;
    },

    getFileModel : function(){
        return fileModel;
    },

    getChunkModel: function(){
        return chunkModel;
    },

    getMongoose : function(){
        return mongoose;
    },

    getUserModel : function( ){
        return userModel;
    },

    newUserModel : function( ){
        return new userModel();
    },

    newObjectId : function(id){
        return new mongoose.Types.ObjectId(id);
    }
};
