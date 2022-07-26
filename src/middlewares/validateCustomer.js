import connection from "../db/postgresStrategy.js";
import customerSchema from "../models/joiCustomers.js";

async function validateCustomer (req, res, next) {
    const newCustomer = req.body;

    const isValidyEntry = customerSchema.validate(newCustomer, { abortEarly: false });

    if(isValidyEntry.error) {
        return res.sendStatus(400);
    }

    try {
        const allCategories = await connection.query(
            'SELECT * FROM customers WHERE cpf = $1', [newCustomer.cpf]
        );

        if (allCategories.rowCount === 1) {
            res.status(409).send();
            return;
        }

        res.locals.newCustomer = newCustomer;
        
        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export default validateCustomer;