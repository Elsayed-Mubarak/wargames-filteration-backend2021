const joi = require("joi");

const timeSchema = {
  date: joi.date().required().raw().required(),
  hours: joi.number().min(1).max(24).required(),
};

module.exports = {
  timeValidation: joi.object(timeSchema),
};
