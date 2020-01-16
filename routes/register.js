const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');

exports.index = (req, res) => {
    if(req.session.logged_in == true){
        res.redirect('/');
    } else {
        res.render('register', { title: 'Register', session: req.session });
    }
};

exports.register = (req, res) => {
    if(req.session.logged_in == true){
        res.send({
            status: 'warning',
            message: 'Registration is unavailable for members'
        });
    } else {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, (err, db) => {
            if (err) console.log('Unable to connect to DB server', err);
            let dbo = db.db("QFC");
            dbo.collection("members").find({email: req.body.email}).toArray((err, result) => {
                if (err) throw err;

                if(result.length > 0){
                    res.send({
                        'status': 'error',
                        'message': 'Email is already registered'
                    });
                } else {
                    let salt = bcrypt.genSaltSync(10);
                    let first_last_names = [req.body.fname, req.body.lname];
                    let other_names = req.body.onames.split(" ");
                    let names = (req.body.onames != "" && other_names.length > 0) ? first_last_names.concat(other_names) : first_last_names;
                    let member_details = {
                        name: names,
                        phone: req.body.phone,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, salt)
                    };
                    dbo.collection("members").insertOne(member_details, (err, result) => {
                        if (err) {
                            res.send({
                                status: 'error',
                                message: 'Error occured during registration'
                            });
                            throw err;
                        }
                        res.send({
                            status: 'success',
                            message: 'User successfully registered'
                        });
                    });
                }
                db.close();
            });
        });
    }
};