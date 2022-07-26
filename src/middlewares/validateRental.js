import connection from "../db/postgresStrategy.js";
import rentalsSchema from "../models/joiRentals.js";

async function validateRental (req, res, next) {
    const newRental = req.body;

    const isValidyEntry = rentalsSchema.validate(newRental, { abortEarly: false });

    if(isValidyEntry.error) {
        res.sendStatus(400);
        return;
    }

    try {
        const checkCustomer = await connection.query(
            'SELECT * FROM customers WHERE id = $1', [newRental.customerId]
        );

        const checkGame = await connection.query(
            'SELECT * FROM games WHERE id = $1', [newRental.gameId]
        );
      
        if (checkCustomer.rowCount === 0 || checkGame.rowCount === 0) {
            res.sendStatus(400);
            return;
        }

        res.locals.newRental = newRental;
        
        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export default validateRental;