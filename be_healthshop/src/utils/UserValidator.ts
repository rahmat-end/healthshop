import * as Joi from "joi"

export const userSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().min(8).max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]{8,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Username harus terdiri dari kombinasi huruf besar dan kecil",
      "string.min": "Username harus minimal 8 karakter",
      "string.max": "Username harus maksimal 15 karakter"
    }),
  password: Joi.string().min(8).max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Password harus terdiri dari kombinasi huruf besar, kecil, dan karakter spesial",
      "string.min": "Password harus minimal 8 karakter",
      "string.max": "Password harus maksimal 15 karakter"
    })
})

export const loginSchema = Joi.object({
  username: Joi.string().min(8).max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]{8,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Username harus terdiri dari kombinasi huruf besar dan kecil",
      "string.min": "Username harus minimal 8 karakter",
      "string.max": "Username harus maksimal 15 karakter"
    }),
  password: Joi.string().min(8).max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Password harus terdiri dari kombinasi huruf besar, kecil, dan karakter spesial",
      "string.min": "Password harus minimal 8 karakter",
      "string.max": "Password harus maksimal 15 karakter"
    })
})