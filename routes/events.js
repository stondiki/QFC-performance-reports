const mongodb = require('mongodb');

exports.index = (req, res) => {
    if(req.session.logged_in == false || req.session.logged_in == null){
        res.redirect('/login');
    } else {
        res.render('events', { title: 'Events', session: req.session });
    }
};

exports.getEvents = (req, res) => {
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            let dbo = db.db('QFC');
            dbo.collection('events').find({}).toArray((err, results) => {
                if(err) throw err;
                res.send({
                    status: 'success',
                    message: 'Here are the events.',
                    data: results,
                    role: req.session.userType
                });
            });
        });
    }
};

exports.addEvent = (req, res) => {
    console.log(req.body);
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
            let dbo = db.db('QFC');
            let ev = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                time: req.body.time,
                venue: req.body.venue,
                entry: req.body.entry
            };
            dbo.collection('events').insertOne(ev, (err, result) => {
                if (err){
                    res.send({
                        status: 'error',
                        message: 'An error occured when creating event.'
                    });
                } else {
                    res.send({
                        status: 'success',
                        message: 'Event created successfully.'
                    });
                }
            });
        });
    }
};

exports.editEvent = (req, res) => {
    console.log(req.body);
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        
    }
};

exports.deleteEvent = (req, res) => {
    console.log(req.body);
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        
    }
};

exports.registerForEvent = () => {
    console.log(req.body);
    if(req.session.logged_in != true){
        res.send({
            status: 'warning',
            message: 'Login to use this feature'
        });
    } else {
        
    }
};