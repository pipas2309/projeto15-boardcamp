import connection from "../db/postgresStrategy.js";

async function getCategories(req, res) {
    try {
        const { rows: response } = await connection.query(
            'SELECT * FROM categories'
        );
        res.status(200).send(response);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function createCategories(req, res) {
    const name = res.locals.name;

    try {
        await connection.query(
            'INSERT INTO categories (name) VALUES ($1)', [name]
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
    getCategories,
    createCategories
} 