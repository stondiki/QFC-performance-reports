const mongodb = require('mongodb');
const cancelOrder = require('./orderResolver');

let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";

function resolveCancels(){
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("members").find({}).toArray((err, results) => {
            if (err) throw err;
            results.forEach(result => {
                if(result.cancellationOrders){
                    result.cancellationOrders.forEach(cancellationOrder => {
                        let x = new Date(cancellationOrder.timestamp - (8*60*60*1000));
                        let y = new Date(Date.now());
                        if(x.getDate() < y.getDate() && x.getHours() < 9){
                            cancelOrder.cancelOrder(result.email, cancellationOrder.stock, cancellationOrder.index);
                        } else if(x.getDate() < y.getDate() && x.getHours() == 9 && x.getMinutes() < 30){
                            cancelOrder.cancelOrder(result.email, cancellationOrder.stock, cancellationOrder.index);
                        } else {
                            cancelOrder.checkCancelOrder(cancellationOrder.stock, cancellationOrder.timestamp, cancellationOrder.originalOrder, result.email, cancellationOrder.index);
                        } 
                    });
                }
                dbo.collection("members").updateOne({email: result.email}, {$set: {cancellationOrders: []}}, (err, result) => {
                    if(err) throw err;
                    db.close();
                });
            });
        }); 
    });
}

function checkOrders() {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("members").find({}).toArray((err, results) => {
            if(err) throw err;
            results.forEach(result => {
                if(result.stocks){
                    result.stocks.forEach(stock => {
                        if(stock.orders){
                            stock.orders.forEach((order, index) => {
                                if(order.status == 'working'){
                                    evaluateOrders(result.email, stock.symbol, index, order);
                                }
                            });
                        }
                    });
                }
            });
        });
        db.close();
    });
}

function evaluateOrders(user, symbol, index, order) {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        let dbo = db.db("QFC");
        dbo.collection("stocks").findOne({symbol: symbol}, (err, result) => {
            if(err) throw err;
            timeSeries = Object.keys(result.intraDay['Time Series (1min)']);
            timeSeries.splice(389, timeSeries.length -1);
            timeSeries.reverse();
            for(x=0; x<timeSeries.length; x++) {
                if (Date.parse(timeSeries[x]) >= (order.timestamp - (8*60*60*1000))){
                    if(order.market == 'buy'){
                        if(order.orderType == 'stop'){
                            if (result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'] >= order.entry){
                               cancelOrder.fillOrder(user, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'], timeSeries[x]);
                               break;
                            }
                        } else if( order.orderType == 'limit'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'] <= order.entry){
                                cancelOrder.fillOrder(user, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'], timeSeries[x]);
                                break;
                            }
                        }
                    } else if (order.market == 'sell'){
                        if(order.orderType == 'stop'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'] <= order.entry){
                                cancelOrder.fillOrder(user, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['3. low'], timeSeries[x]);
                                break;
                            }
                        } else if( order.orderType == 'limit'){
                            if(result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'] >= order.entry){
                                cancelOrder.fillOrder(user, symbol, index, result.intraDay['Time Series (1min)'][timeSeries[x]]['2. high'], timeSeries[x]);
                                break;
                            }
                        }
                    }
                }
            }
        });
        db.close();
    });
}

resolveCancels();
checkOrders();
