import Joi from 'joi';

const createSchema = (isJobApplication) => {
  return Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.base': `"namn" måste vara en sträng.`,
      'string.min': `"namn" måste vara minst 2 tecken långt.`,
      'string.max': `"namn" får vara högst 100 tecken långt.`,
      'any.required': `"namn" är ett obligatoriskt fält.`,
    }),
    email: Joi.string().email({ tlds: false }).required().messages({
      'string.base': `"E-post" måste vara en giltig e-postadress.`,
      'any.required': `"E-post" är ett obligatoriskt fält.`,
    }),
    subject: Joi.string().min(3).max(255).required().messages({
      'string.base': `"ämne" måste vara en sträng.`,
      'string.min': `"ämne" måste vara minst 3 tecken långt.`,
      'string.max': `"ämne" får vara högst 255 tecken långt.`,
      'any.required': `"ämne" är ett obligatoriskt fält.`,
    }),
    message: Joi.string().min(10).max(2000).required().messages({
      'string.base': `"meddelande" måste vara en sträng.`,
      'string.min': `"meddelande" måste vara minst 10 tecken långt.`,
      'string.max': `"meddelande" får vara högst 2000 tecken långt.`,
      'any.required': `"meddelande" är ett obligatoriskt fält.`,
    }),
    file: isJobApplication ? Joi.required().messages({
      'any.required': `"file" är obligatoriskt.`,
    }) : Joi.optional(),
  });
};

export const validateFormData = (formData, isJobApplication) => {
  const schema = createSchema(isJobApplication); 
  const { error } = schema.validate(formData, {
    abortEarly: false,
  });

  return error ? error.details.map(e => e.message) : [];
};

