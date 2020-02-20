const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');

exports.index = (req, res) => {
    if(req.session.logged_in == true){
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login', session: req.session });
    }
};

exports.login = (req, res) => {
    if(req.session.logged_in == true){
        res.send({
            status: 'warning',
            message: 'You are already logged in.'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;

            let dbo = db.db("QFC");
            dbo.collection("members").find({email: req.body.email}).toArray((err, result) => {
                if (err) throw err;

                if(result.length == 1){
                    if(bcrypt.compareSync(req.body.password, result[0].password)){
                        req.session.logged_in = true;
                        req.session.email = result[0].email;
                        req.session.name = result[0].name[0] + ' ' + result[0].name[1];
                        req.session.userType = result[0].userType;
                        res.send({
                            status: 'success',
                            message: 'You have been logged in'
                        });
                    } else {
                        res.send({
                            status: 'error', 
                            message:'Invalid username or password.'
                        });
                    }
                } else if(result.length == 0){
                    res.send({
                        status: 'error', 
                        message:'Invalid username or password'
                    });
                } else {
                    res.send({
                        status: 'error', 
                        message:'Error finding user'
                    });
                }
            });
            db.close();
        });
    }
};

exports.logout = (req, res) => {
    req.session.logged_in = false;
    req.session.email = null;
    req.session.name = null;
    req.session.userType = null;
    res.send({
        status: 'success',
        message: 'You have been logged out'
    });
};