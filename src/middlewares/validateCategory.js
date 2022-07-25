import connection from "../db/postgresStrategy.js";
import categorySchema from "../models/joiCategories.js";

async function validateCategory (req, res, next) {
    const newCategory = req.body;

    const isValidyEntry = categorySchema.validate(newCategory, { abortEarly: false });

    if(isValidyEntry.error) {
        return res.sendStatus(400);
    }

    try {
        const allCategories = await connection.query(
            'SELECT * FROM categories WHERE name = $1', [newCategory.name]
        );

        if (allCategories.rowCount === 1) {
            res.status(409).send();
            return;
        }

        res.locals.name = newCategory.name;
        
        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export default validateCategory;