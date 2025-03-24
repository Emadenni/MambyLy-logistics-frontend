import Joi from "joi";

export const createSchema = Joi.object({
  positionId: Joi.string().min(2).max(20).required().messages({
    'string.base': `"Position ID" måste vara en sträng.`,
    'string.min': `"Position ID" måste vara minst 2 tecken långt.`,
    'string.max': `"Position ID" får vara högst 20 tecken långt.`,
    'any.required': `"Position ID" är ett obligatoriskt fält.`,
  }),
  departure: Joi.string().min(2).max(20).required().messages({
    'string.base': `"Departure" måste vara en sträng.`,
    'string.min': `"Departure" måste vara minst 2 tecken långt.`,
    'string.max': `"Departure" får vara högst 20 tecken långt.`,
    'any.required': `"Departure" är ett obligatoriskt fält.`,
  }),
  destination: Joi.string().min(3).max(20).required().messages({
    'string.base': `"Destination" måste vara en sträng.`,
    'string.min': `"Destination" måste vara minst 3 tecken långt.`,
    'string.max': `"Destination" får vara högst 20 tecken långt.`,
    'any.required': `"Destination" är ett obligatoriskt fält.`,
  }),
  distance: Joi.string().min(3).max(10).required().messages({
    'string.base': `"Distance" måste vara en sträng.`,
    'string.min': `"Distance" måste vara minst 3 tecken långt.`,
    'string.max': `"Distance" får vara högst 10 tecken långt.`,
    'any.required': `"Distance" är ett obligatoriskt fält.`,
  }),
  type: Joi.string().min(3).max(30).required().messages({
    'string.base': `"Type" måste vara en sträng.`,
    'string.min': `"Type" måste vara minst 3 tecken långt.`,
    'string.max': `"Type" får vara högst 30 tecken långt.`,
    'any.required': `"Type" är ett obligatoriskt fält.`,
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
  