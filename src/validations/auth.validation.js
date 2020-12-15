const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required().custom(password)
      .strict(),
    userType: Joi.string().required()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

module.exports = {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword
};
