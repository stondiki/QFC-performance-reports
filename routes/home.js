exports.index = (req, res) => {
    res.render('home', { title: 'Home', session: req.session });
};