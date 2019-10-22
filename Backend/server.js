// Importing dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var compression = require('compression')
var secure = require('express-secure-only');
var helmet = require('helmet');
var path = require('path');
const session = require('express-session');
const logger = require('./utils/logger')(__filename);

const app = express();
app.use(compression());
app.enable('trust proxy');
require('dotenv').config();

//Saml Configuration
const passport = require("passport");
const samlConfig = require('./utils/saml')[process.env.SSO_PROFILE || 'dev'];

// Configure passport SAML strategy parameters
require('./lib/passport')(passport, samlConfig);

// security features enabled in production
if (app.get('env') === "production") {
    // redirects http to https
    app.use(secure());

    // helmet with defaults
    app.use(helmet());
}

corsoptions = {
    "origin": ["http://localhost:4200", "https://localhost:4200"],
    "credentials": true,
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "maxAge": 1234,
    "allowedHeaders": ['application/json', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    "allowMethods": ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsoptions));
app.options('*', cors(corsoptions));

// enable session
app.use(session({
    secret:  "Secret" + Math.floor(Math.random() * 1000000),
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: {maxAge:1000*60*2500}
}));

app.use(passport.initialize());
app.use(passport.session());

// error handler
app.use(function (err, req, res, next) {
    if (err) {
        logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(err.status || 500);
        res.send('Server Error');
    }
    else {
        logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
        next();
    }
});

app.use('/', require('./router/secure')(app, samlConfig, passport));
app.use(express.static(path.join(__dirname, 'dist')));

//Router

app.use('', require('./router/api'));

module.exports = app;

//Listening Port
// var port = process.env.PORT || 4000;
// app.listen(port, () => { logger.info(`port ${port} is connected to server`) });