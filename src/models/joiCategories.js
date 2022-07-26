import joi from 'joi';

const categorySchema = joi.object({
    name: joi.string().min(1).required()
});

export default categorySchema;