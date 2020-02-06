const mongodb = require('mongodb');

let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";
let users = [];

function getUsers(){
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("members").find({}).toArray((err, result) => {
            if(err) throw err;
            users = result;
            db.close();
            while(users.length){
                if(users[0].cancellationOrder){
                    if(users[0].cancellationOrder.length){

                    }
                }
            }
        });
    });
}

function checkCancellation() {
    
}