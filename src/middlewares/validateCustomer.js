import connection from "../db/postgresStrategy.js";
import gamesSchema from "../models/joiGames.js";

async function validateGame (req, res, next) {
    const newGame = req.body;

    const isValidyEntry = gamesSchema.validate(newGame, { abortEarly: false });

    if(isValidyEntry.error) {
        return res.sendStatus(400);
    }

    try {
        const allCategories = await connection.query(
            'SELECT * FROM games WHERE name = $1', [newGame.name]
        );

        if (allCategories.rowCount === 1) {
            res.status(409).send();
            return;
        }

        res.locals.newGame = newGame;
        
        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export default validateGame;