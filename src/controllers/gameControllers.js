import connection from "../db/postgresStrategy.js";

async function getGames(req, res) {
    try {
        const { rows: response } = await connection.query(
            'SELECT * FROM games'
        );
        res.status(200).send(response);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function createGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.newGame;

    try {
        await connection.query(
            'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', 
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export {
    getGames,
    createGames
} 