import Joi from 'joi';

const createSchema = (isJobApplication) => {
  return Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.base': `"name" måste vara en sträng.`,
      'string.min': `"name" måste vara minst 2 tecken långt.`,
      'string.max': `"name" får vara högst 100 tecken långt.`,
      'any.required': `"name" är ett obligatoriskt fält.`,
    }),
    email: Joi.string().email({ tlds: false }).required().messages({
      'string.base': `"email" måste vara en giltig e-postadress.`,
      'any.required': `"email" är ett obligatoriskt fält.`,
    }),
    subject: Joi.string().min(3).max(255).required().messages({
      'string.base': `"subject" måste vara en sträng.`,
      'string.min': `"subject" måste vara minst 3 tecken långt.`,
      'string.max': `"subject" får vara högst 255 tecken långt.`,
      'any.required': `"subject" är ett obligatoriskt fält.`,
    }),
    message: Joi.string().min(10).max(2000).required().messages({
      'string.base': `"message" måste vara en sträng.`,
      'string.min': `"message" måste vara minst 10 tecken långt.`,
      'string.max': `"message" får vara högst 2000 tecken långt.`,
      'any.required': `"message" är ett obligatoriskt fält.`,
    }),
    file: isJobApplication ? Joi.required().messages({
      'any.required': `"file" är obligatoriskt när du ansöker om ett jobb.`,
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
