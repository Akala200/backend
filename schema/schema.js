const Joi = require('joi')

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(3).max(30).required(),
  password: Joi.string().trim().min(10).required(),

  firstName : Joi.string(),
  lastName : Joi.string(),
  email :  Joi.string().email(),

  imageURL: Joi.string().uri({
    scheme: [
      /https?/
    ]
  }),
  
});

const regularAccesibliltyLevel = Joi.object().keys({
  campaignPass : Joi.boolean(), //done
  productPass : Joi.boolean(), // done
  viewDashboardOnly : Joi.boolean(), // uslesss nigga 
  approveCampaign : Joi.boolean(),
  createAdmin : Joi.boolean(), // done
})

const userQuey = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(3).max(30),// username of the admin to be edited
  password: Joi.string().trim().min(10),
  campaignPass : Joi.boolean(), //done
  productPass : Joi.boolean(), // done
  viewDashboardOnly : Joi.boolean(), // uslesss nigga 
  approveCampaign : Joi.boolean(),
  createAdmin : Joi.boolean(), // done
})


module.exports = {
  schema,
  regularAccesibliltyLevel,
  userQuey
}