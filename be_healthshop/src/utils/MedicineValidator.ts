import * as Joi from "joi"

export const medicineSchema = Joi.object({
    kfa_code: Joi.string().required(),
    name: Joi.string().required(),
    image: Joi.string().allow(null, '').optional(),
    fix_price: Joi.number().required(),
    description: Joi.string().allow(null, '').optional(),
    user: Joi.number().allow(null).optional()
})