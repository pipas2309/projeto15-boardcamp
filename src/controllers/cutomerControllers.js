import connection from "../db/postgresStrategy.js";

async function getCustomers(req, res) {
    const { cpf } = req.query;

    try {
        if(cpf) {
            const { rows: response } = await connection.query(
                `SELECT * FROM customers WHERE cpf LIKE $1 || '%'`,
                [cpf]
            );

            res.status(200).send(response);
            return;
        }

        const { rows: response } = await connection.query(
            'SELECT * FROM customers'
        );
        res.status(200).send(response);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function getCustomer(req, res) {
    const { id } = req.params;
    console.log(id)

    try {
        const { rows: response } = await connection.query(
            'SELECT * FROM customers'
        );
        res.status(200).send(response);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function createCustomer(req, res) {
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

async function updateCustomer(req, res) {
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
    getCustomer,
    getCustomers,
    createCustomer,
    updateCustomer
}