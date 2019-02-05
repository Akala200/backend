const express = require('express');

const Joi = require('joi')

const ObjectID = require('mongodb').ObjectID;
const db = require('../dbconnections/adminConnection'); //establish database connection to the admin databse
const users = db.get('users'); //define a database collection as a const

const userQuery = require('../schema/schema').userQuey
const bcrypt = require('bcryptjs');

const router = express.Router();

function code422(res, next) {
  res.status(422); //UNPROCESSABLE ENTITY
  const error = new Error('You enetered a Wrong PassWord'); 
  next(error); 
}

// list all users
router.get('/', (req, res) => {
  users.find({})
  .then((response) => {
    res.json(response)
  })
})



// edit a users role
// reconfirm password
router.post('/edit', (req, res, next) => {
  const result = Joi.validate(req.body, userQuery)
  if (result.error === null) {

  const passwordHashed = req.user.password
  const {username,password} = req.body // username to query , password of the super

  const updateItems = {
    campaignPass : req.body.campaignPass,
    productPass : req.body.productPass,
    approveCampaign : req.body.approveCampaign,
    viewDashboardOnly : req.body.viewDashboardOnly,
    createAdmin : req.body.createAdmin,
  }

  //
  deleteEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
      obj[key] === undefined ? delete obj[key] : ''
    })
    return obj
  }

  deleteEmpty(updateItems)

  const a = {
    accessLevel : updateItems
  }

  console.log(a)

    users.findOne({
      username
    })
    .then((response) => {
      if (response === null) {
        res.json('OOPs No such USer Exists')
      } else {
        // compare passwords
        // response.access level and add to current new list
        // filter respnsoe.acccessLevel with key of update items
        // spread lefts into a constant
        // const like a into db
        bcrypt
        .compare(password, passwordHashed)
        .then((result) => {
        if (result) { // if result is true, proper passwords
        // edit user role here
          console.log('edit user role here')
          console.log(updateItems)

          users
          .update({username}, 
          {$set: a}, function(err, result) {
          }).then( responded => {
              res.json(responded)
          })
          
        } else {
          code422(res, next);
        }
      });
      }
    })
  } else {
    code422(res, next);
  }
})


// delete a user
router.post('/:id', (req, res) => {
  const result = Joi.validate(req.body, userQuery)
  if (result.error === null) {

    const passwordHashed = req.user.password

    const {password} = req.body
    const id = req.params.id

    users.findOne({
      _id : ObjectID(id)
    })
    .then((response) => {
      if (response === null) {
        res.json('OOPs No such USer Exists')
      } else {
        // compare passwords
        bcrypt
        .compare(password, passwordHashed)
        .then((result) => {
        if (result) { // if result is true, proper passwords

    users.remove({
      _id : ObjectID(id)
    }).then((response) => {
        if (response.ok > 0) {
          res.json('Delete succesful')
        } else {
          res.json('Unsuccesful delete')
        }
    })
      } else {
        code422(res, next);
      }
    });
      }
    })
    } else {
      code422(res, next);
    }
  
})

module.exports = router;