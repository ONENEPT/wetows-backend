const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().min(11).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(7).required().strict(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
    userType: Joi.string().required()
  })
    .unknown(true)
};

const getUsers = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    email: Joi.string(),
    userType: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password)
    })
    .min(1)
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
