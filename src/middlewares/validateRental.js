import connection from "../db/postgresStrategy.js";
import rentalsSchema from "../models/joiRentals.js";

async function validateRental (req, res, next) {
    const newCustomer = req.body;

    const id = req.params.id || null;

    const isValidyEntry = rentalsSchema.validate(newCustomer, { abortEarly: false });

    if(isValidyEntry.error) {
        return res.sendStatus(400);
    }

    if(id) {
        try {
            const allCategories = await connection.query(
                'SELECT * FROM customers WHERE cpf = $1 AND id <> $2', 
                [newCustomer.cpf, id]
            );
    
            if (allCategories.rowCount === 1) {
                res.status(409).send();
                return;
            }
    
            res.locals.customer = newCustomer;
            
            next();
            return;   

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
            return; 
        }
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

export default validateRental;