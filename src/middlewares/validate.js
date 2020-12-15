const pick = require('lodash');
const Joi = require('@hapi/joi');
const Schemas = require('../validations/user.validation');

module.exports = (useJoiError = false) => {
  // useJoiError determines if we should respond with the base Joi error
  // boolean: defaults to false
  const useJoiErrors = pick.isBoolean(useJoiError) && useJoiError;

  // enabled HTTP methods for request data validation
  const supportedMethods = ['post', 'put'];

  // Joi validation options
  const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true // remove unknown keys from the validated data
  };

  // return the validation middleware
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    const route = req.route.path;
    const method = req.method.toLowerCase();

    if (pick.includes(supportedMethods, method) && pick.has(Schemas, route)) {
      // get schema for the current route
      const schema = pick.get(Schemas, route);

      if (schema) {
        // Validate req.body using the schema and validation options
        return Joi.validate(req.body, schema, validationOptions, (err, data) => {
          if (err) {
            // Joi Error
            const JoiError = {
              status: 'failed',
              error: {
                // eslint-disable-next-line no-underscore-dangle
                original: err._object,
                // fetch only message and type from each error
                details: pick.map(err.details, ({ message, type }) => ({
                  message: message.replace(/['"]/g, ''),
                  type
                }))
              }
            };

            // Custom Error
            const CustomError = {
              status: 'failed',
              error: 'Invalid request data. Please review request and try again.'
            };
            // Send back the JSON error response
            res.status(422).json(useJoiErrors ? JoiError : CustomError);
          } else {
            // Replace req.body with the data after Joi validation
            req.body = data;
            next();
          }
        });
      }
    }
    next();
  };
};
