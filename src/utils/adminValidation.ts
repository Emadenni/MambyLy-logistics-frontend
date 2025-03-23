import Joi from 'joi';
import { AdminData } from "../types/common";

const createSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.base': `"firstName" must be a string.`,
    'string.min': `"firstName" must be at least 2 characters long.`,
    'string.max': `"firstName" must be at most 50 characters long.`,
    'any.required': `"firstName" is a required field.`,
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.base': `"lastName" must be a string.`,
    'string.min': `"lastName" must be at least 2 characters long.`,
    'string.max': `"lastName" must be at most 50 characters long.`,
    'any.required': `"lastName" is a required field.`,
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.base': `"email" must be a valid email address.`,
    'string.email': `"email" must be a valid email address.`,
    'any.required': `"email" is a required field.`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password" must be a string.`,
    'string.min': `"password" must be at least 6 characters long.`,
    'any.required': `"password" is a required field.`,
  }),
  profileImage: Joi.string().uri().optional().messages({
    'string.uri': `"profileImage" must be a valid URI.`,

  }),
});

export const adminValidation = (adminData: AdminData) => {  
  const { error } = createSchema.validate(adminData, {
    abortEarly: false,
  });
  return error ? error.details.map(e => e.message) : [];
};
