import Joi from "joi";
export const loginSchema = Joi.object<{ email: string; password: string }>({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

export const registerSchema = Joi.object<{
  email: string;
  password: string;
  name: string;
}>({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters",
  }),
  name: Joi.string().min(4).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 4 characters",
  }),
}).options({ abortEarly: false });

export const toErrorObject = (error: Joi.ValidationError) => {
  const res: any = {};
  for (const err of error.details) {
    if (err.context && err.context.key) {
      res[err.context.key] = err.message;
    }
  }
  return res;
};
