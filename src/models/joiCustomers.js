import joi from 'joi';
import date from '@joi/date';

const Joi = joi.extend(date);

const customerSchema = Joi.object({
    name: Joi.string().min(1).required(),
    phone: Joi.string().pattern(/[0-9]{10,11}/).required(),
    cpf: Joi.string().pattern(/[0-9]{11}/).required(),
    birthday: Joi.date().format("YYYY-MM-DD").utc().required()
});

export default customerSchema;
