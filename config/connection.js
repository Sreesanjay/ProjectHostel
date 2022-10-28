<<<<<<< HEAD
const MongoClient = require('mongodb').MongoClient
=======
/*const MongoClient = require('mongodb').MongoClient
>>>>>>> master

const state={
    db:null
}

<<<<<<< HEAD
module.exports.connect=(done)=>{
    const url="mongodb://0.0.0.0:27017/"
    const dbname='hosteldb'

    MongoClient.connect(url, { useNewUrlParser: true },(err,data)=>{
    
=======
module.exports.connect=function(done){
    const url='mongodb://localhost:27017'
    const dbname='HostelDb'

    MongoClient.connect(url, { useNewUrlParser: true },(err,data)=>{
>>>>>>> master
        if(err) return done(err)
        state.db=data.db(dbname)
        done();
    })
    module.exports.get=function(){
        return state.db
    }
<<<<<<< HEAD
}
=======
}*/
>>>>>>> master
