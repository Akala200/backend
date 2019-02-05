const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../dbconnections/adminConnection'); //establish database connection to the admin databse
const users = db.get('users'); //define a database collection as a const
users.createIndex('username', { unique: true}); // increase speed of username query, give direct link to query
const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(3).max(30).required(),
  password: Joi.string().trim().min(10).required()
});

// passive aggressive middlewares? lool

function createTokenSendResponse(user, res, next) { // create token with token respnsone 
  const payload = {...user};
  
  jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1d'
  },(err, token) => {
    if (err) {
      code422(res, next); // unable to login error
    } else {
      res.json({
        token
      });
    }
  });
}


// any route in here is pre-handled with /auth/admin/

router.get('/', (req,res) => {
  res.json({
    message: 'Admin 🔐'
  })
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// error code for login
function code422(res, next) {
  res.status(422); //UNPROCESSABLE ENTITY
  const error = new Error('Unable to Login'); //restrict hint of failed attempt solutions
  next(error); //forwards to error handler func
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/login', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    users.findOne({
      username: req.body.username,
    }).then( user => {
      console.log('this is user', user)
       if (user) {
        let tokenData;
        if (user) {
          // compare passords
          bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
          if (result) { // if result is true, proper passwords
            createTokenSendResponse(tokenData, res, next);
          } else {
            code422(res, next);
          }
        });

        } else {
          // compare passords
          bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
          if (result) { // if result is true, proper passwords
            createTokenSendResponse(tokenData, res, next);
          } else {
            code422(res, next);
          }
        });
        }

       } else {
         code422(res, next);
       }
    });
  } else {
    code422(res, next);
  }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;