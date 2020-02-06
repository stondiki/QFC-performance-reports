const fetch = require('node-fetch');
const mongodb = require('mongodb');

let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";
let stocks = [];

function getStocks() {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("stocks").find({}).toArray((err, result) => {
            if (err) throw err;
            stocks = result;
            db.close();
            while(stocks.length){
                getIntraday(stocks.shift());
            }
        });
    });
}

function getIntraday(stock) {
    if(stock.userCount > 0){
        let intraUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+stock.symbol+'&interval=1min&outputsize=full&apikey='+process.env.API_KEY;
        fetch(intraUrl)
        .then(resp => resp.json())
        .then(data => {
            MongoClient.connect(url, (err, db) => {
                if (err) throw err;
                let dbo = db.db("QFC");
                dbo.collection("stocks").updateOne({symbol: stock.symbol}, {$set: {intraDay: data}}, (err, result) => {
                    if(err) throw err;
                    console.log('Added intraday data for '+stock.symbol );
                    db.close();
                });
            });
        });
    } 
}

getStocks();