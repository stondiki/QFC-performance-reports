const mongodb = require('mongodb');

let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";

exports.cancelOrder = (user, stock, index) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("members").findOne({email: user}, (err, result) => {
            if(err) throw err;
            result.stocks.forEach(symbol => {
                if(symbol.symbol == stock){
                    if(symbol.orders[index].status == 'working'){
                        symbol.orders[index].status = 'cancelled';
                        dbo.collection("members").updateOne({email: user}, {$set: {stocks: result.stocks}}, (err, result) => {
                            if(err) throw err;
                            db.close();
                        });
                    }
                }
            });
        });
    });
};

exports.fillOrder = (user, stock, index, fillPrice, fillTime) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("members").findOne({email: user}, (err, result) => {
            if(err) throw err;
            result.stocks.forEach(symbol => {
                if(symbol.symbol == stock){
                    if(symbol.orders[index].status == 'working'){
                        symbol.quantity += symbol.orders[index].amount * 1;
                        symbol.orders[index].fillPrice = fillPrice;
                        symbol.orders[index].fillTime = fillTime;
                        symbol.orders[index].status = 'filled';
                        dbo.collection("members").updateOne({email: user}, {$set: {stocks: result.stocks}}, (err, result) => {
                            if (err) throw err;
                            db.close();
                        });
                    }
                }
            });
        });
        db.close();
    });
};

exports.checkCancelOrder = (symbol, time, order, email, index) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("stocks").findOne({symbol: symbol}, (err, result) => {
            if(err) throw err;
            timeSeries = Object.keys(result.intraDay['Time Series (1min)']);
            timeSeries.splice(389, timeSeries.length -1);
            timeSeries.reverse();
            for(x=0; x<timeSeries.length; x++) {
                if(Date.parse(timeSeries[x]) <= time && Date.parse(timeSeries[x]) >= (order.timestamp - (8*60*60*1000))){
                    if(order.market == 'buy'){
                        if(order.orderType == 'stop'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'] >= order.entry){
                                this.fillOrder(email, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'], timeSeries[x]);
                                break;
                            } else {
                                this.cancelOrder(email, symbol, index);
                                break;
                            }
                        } else if (order.orderType == 'limit'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'] <= order.entry){
                                this.fillOrder(email, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'], timeSeries[x]);
                                break;
                            } else {
                                this.cancelOrder(email, symbol, index);
                                break;
                            }
                        }
                    } else if (order.market == 'sell'){
                        if(order.orderType == 'stop'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'] <= order.entry){
                                this.fillOrder(email, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'], timeSeries[x]);
                                break;
                            } else {
                                this.cancelOrder(email, symbol, index);
                                break;
                            }
                        } else if (order.orderType == 'limit'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'] >= order.entry){
                                this.fillOrder(email, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'], timeSeries[x]);
                                break;
                            } else {
                                this.cancelOrder(email, symbol, index);
                                break;
                            }
                        }
                    }
                }
            }
        });
        db.close();
    });
};