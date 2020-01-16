if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const express = require('express');
const session = require('express-session');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT;

routes(app);

app.listen(port, () => {
    console.log('Server running on port ' + port);
});

//module.exports = app;