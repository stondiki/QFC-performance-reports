const mongodb = require('mongodb');

exports.index = (req, res) => {
    if(req.session.logged_in == false || req.session.logged_in == null){
        res.redirect('/login');
    } else {
        res.render('stocks', { title: 'Stocks', session: req.session });
    }
};

exports.getStocks = (req, res) => {
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            let dbo = db.db("QFC");
            dbo.collection("members").findOne({email: req.session.email}, (err, result) => {
                if (err) throw err;
                if(result.stocks){
                    res.send({
                        status: 'success',
                        message: 'Stocks found',
                        data: result.stocks
                    });
                } else {
                    res.send({
                        status: 'warning',
                        message: 'No stocks found',
                        data: result.stocks
                    });
                }
            });
        });
    }
};

exports.addStock = (req, res) => {
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";
        var symbol = req.body.symbol;

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            let dbo = db.db("QFC");
            dbo.collection("members").findOne({email: req.session.email}, (err, result) => {
                if (err) throw err;
                if(result.stocks){
                    if(result.stocks.find((sym) => {
                        return sym.symbol == req.body.symbol;
                    })){
                        res.send({
                            status: 'warning',
                            message: 'The stock already exists'
                        });
                        db.close();
                    } else {
                        result.stocks.push({symbol: req.body.symbol});
                        dbo.collection("members").updateOne({email: req.session.email}, {$set: {stocks: result.stocks}}, (err, result) => {
                            if(err) throw err;
                            dbo.collection("stocks").findOne({symbol: symbol}, (err, result) => {
                                if (err) throw err;
                                if(result){
                                    if(result.symbol == symbol){
                                        result.userCount = ((result.userCount * 1) + 1);
                                        dbo.collection("stocks").updateOne({symbol: symbol}, {$set: {userCount: result.userCount}}, (err, result) => {
                                            if(err) throw err;
                                            res.send({
                                                status: 'success',
                                                message: 'Stock added successfully'
                                            });
                                            db.close();
                                        });
                                    }
                                } else {
                                    let stock = {
                                        symbol: req.body.symbol,
                                        userCount: 1
                                    };
                                    dbo.collection("stocks").insertOne(stock, (err, result) => {
                                        if(err) throw err;
                                        res.send({
                                            status: 'success',
                                            message: 'Stock added successfully'
                                        });
                                        db.close();
                                    });
                                }
                            });
                        });
                    }
                } else {
                    dbo.collection("members").updateOne({email: req.session.email}, {$set: {stocks: [{symbol: req.body.symbol}]}}, (err, result) => {
                        if (err) throw err;
                        dbo.collection("stocks").findOne({symbol: symbol}, (err, result) => {
                            if (err) throw err;
                            if(result.symbol == req.body.symbol){
                                result.userCount = ((result.userCount * 1) + 1);
                                dbo.collection("stocks").updateOne({symbol: symbol}, {$set: {userCount: result.userCount}}, (err, result) => {
                                    if(err) throw err;
                                    res.send({
                                        status: 'success',
                                        message: 'Stock added successfully'
                                    });
                                    db.close();
                                });
                            } else {
                                let stock = {
                                    symbol: symbol,
                                    userCount: 1
                                };
                                dbo.collection("stocks").insertOne(stock, (err, result) => {
                                    if(err) throw err;
                                    res.send({
                                        status: 'success',
                                        message: 'Stock added successfully'
                                    });
                                    db.close();
                                });
                            }
                        });
                    });
                }
            });
        });
    }
};

exports.deleteStock = (req, res) => {

};

exports.getOrders = (req, res) => {
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            let dbo = db.db("QFC");
            dbo.collection("members").findOne({email: req.session.email}, (err, result) => {
                if (err) throw err;
                if(result.stocks){
                    result.stocks.forEach(stock => {
                        if(stock.symbol == req.body.symbol){
                            if(stock.orders && stock.orders.length){
                                res.send({
                                    status: 'success',
                                    message: 'Here are the orders',
                                    data: stock.orders
                                });
                                db.close();
                            } else {
                                res.send({
                                    status: 'success',
                                    message: 'The stock has no orders'
                                });
                                db.close();
                            }
                        }
                    });
                }
            });
        });
    }
};

exports.addOrder = (req, res) => {
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            let dbo = db.db("QFC");
            dbo.collection("members").findOne({email: req.session.email}, (err, result) => {
                if (err) throw err;
                if (result.stocks){
                    result.stocks.forEach((stock, index) => {
                        if(stock.symbol == req.body.symbol){
                            if(stock.orders){
                                stock.orders.push({
                                    market: req.body.market,
                                    entry: req.body.entry,
                                    amount: req.body.amount,
                                    orderType: req.body.order,
                                    tradeType: req.body.tradeType,
                                    status: 'working',
                                    timestamp: Date.now()
                                });
                                dbo.collection("members").updateOne({email: req.session.email}, {$set: {stocks: result.stocks}}, (err, result) => {
                                    if (err) throw err;
                                    res.send({
                                        status: 'success',
                                        message: 'Order added successfuly'
                                    });
                                    db.close();
                                });
                            } else {
                                stock.orders = [{
                                    market: req.body.market,
                                    entry: req.body.entry,
                                    amount: req.body.amount,
                                    orderType: req.body.order,
                                    tradeType: req.body.tradeType,
                                    status: 'working',
                                    timestamp: Date.now()
                                }];
                                dbo.collection("members").updateOne({email: req.session.email}, {$set: {stocks: result.stocks}}, (err, result) => {
                                    if (err) throw err;
                                    res.send({
                                        status: 'success',
                                        message: 'Order added successfuly'
                                    });
                                    db.close();
                                });
                            }
                        }
                    });
                }
            });
        });
    }
};

exports.cancelOrder = (req, res) => {
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            let dbo = db.db("QFC");
            dbo.collection("members").findOne({email: req.session.email}, (err, result) => {
                if (err) throw err;
                if(result.stocks){
                    var sres = [];
                    result.stocks.forEach((stock) => {
                        if(stock.symbol = req.body.symbol){
                            if(stock.orders){
                                stock.orders.forEach((order, index) => {
                                    if(order.market == req.body.market && order.entry == req.body.entry && order.amount == req.body.amount && order.orderType == req.body.orderType && order.tradeType == req.body.tradeType && order.status == req.body.status && order.timestamp == req.body.timestamp){
                                        sres.push({
                                            stock: req.body.symbol,
                                            originalOrder: order,
                                            index: index,
                                            action: 'cancel',
                                            timestamp: Date.now()
                                        });
                                    }
                                });
                            }
                        }
                    });
                    console.log(sres.length, sres);
                    if(sres.length == 1){
                        if(result.cancellationOrders){
                            result.cancellationOrders.push(sres[0]);
                            dbo.collection("members").updateOne({email: req.session.email}, {$set: {cancellationOrders: result.cancellationOrders}}, (err, result) => {
                                if(err) throw err;
                                res.send({
                                    status: 'success',
                                    message: 'Order cancellation submitted successfully'
                                });
                                db.close();
                            });
                        } else {
                            dbo.collection("members").updateOne({email: req.session.email}, {$set: {cancellationOrders: sres}}, (err, result) => {
                                if(err) throw err;
                                res.send({
                                    status: 'information',
                                    message: 'Order cancellation submitted successfully'
                                });
                                db.close();
                            });
                        }
                        console.log(sres);
                    } else if (sres.length < 1){
                        res.send({
                            status: 'error',
                            message: 'No orders matches the request'
                        });
                    } else {
                        res.send({
                            status: 'error',
                            message: 'More than one order matches the request'
                        });
                    }
                } else {
                    res.send({
                        status: 'error',
                        message: 'No stocks exist'
                    });
                    db.close();
                }
            });
        });
    }
};