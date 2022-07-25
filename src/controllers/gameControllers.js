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
    const newGame = res.locals.newGame;

    try {
        await connection.query(
            'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', 
            [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]
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