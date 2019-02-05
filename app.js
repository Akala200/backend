const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

require('dotenv').config();
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const middlewares = require('./auth/middlewares'); // 
const authAdmin = require('./auth/admin.index');

// regular addmin access Level identifiers


const user = require('./api/users');
const admin = require('./api/admin');  // TEST
const routePath = require('./routes/routePath');

const { notFound, errorHandler} = require('./middlewares')

const app = express();

app.use(volleyball); //Logs every single incoming request
app.use(cors({        // client side request from different origins
  origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());

app.use(middlewares.checkTokenSetUser);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'cms auth headers! 🌈✨🦄',
  });
});

app.use(routePath.authAdminPath, authAdmin);// General Login spots

//signup for supers and regulars regularMiddleWares.createAdminAccessGrant

app.use(routePath.adminPath, admin)// TEST

app.use(routePath.userPath, user)// TEST

// catch 404 and forward to error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
