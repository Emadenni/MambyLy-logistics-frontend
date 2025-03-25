import Joi from "joi";

export const createSchema = Joi.object({

  departure: Joi.string().min(2).max(20).required().messages({
    'string.base': `"Departure" must be a string.`,
    'string.min': `"Departure" must be at least 2 characters long.`,
    'string.max': `"Departure" can be at most 20 characters long.`,
    'any.required': `"Departure" is a required field.`,
  }),
  destination: Joi.string().min(3).max(20).required().messages({
    'string.base': `"Destination" must be a string.`,
    'string.min': `"Destination" must be at least 3 characters long.`,
    'string.max': `"Destination" can be at most 20 characters long.`,
    'any.required': `"Destination" is a required field.`,
  }),
  distance: Joi.string().min(3).max(10).required().messages({
    'string.base': `"Distance" must be a string.`,
    'string.min': `"Distance" must be at least 3 characters long.`,
    'string.max': `"Distance" can be at most 10 characters long.`,
    'any.required': `"Distance" is a required field.`,
  }),
  type: Joi.string().min(3).max(30).required().messages({
    'string.base': `"Type" must be a string.`,
    'string.min': `"Type" must be at least 3 characters long.`,
    'string.max': `"Type" can be at most 30 characters long.`,
    'any.required': `"Type" is a required field.`,
  }),
});

export const validatePositionData = (formData) => {
  const { error } = createSchema.validate(formData, {
    abortEarly: false, 
  });

  if (error) {
    return error.details.map(e => e.message); 
  }

  return []; 
};
