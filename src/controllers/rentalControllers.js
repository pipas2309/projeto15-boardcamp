import connection from "../db/postgresStrategy.js";

async function getRentals(req, res) {
    const { customerId, gameId } = req.query;

    let postgresQuery = '';
    let params = [];

    try {
        
        if(customerId){
            postgresQuery += `WHERE "customerId" = $${params.length + 1} `;
            params.push(customerId);
        }

        //Ternario para saber se usa WHERE ou AND
        if(gameId){
            postgresQuery += `${postgresQuery === '' ? 'WHERE' : 'AND'} "gameId = $${params.length + 1} `;
            params.push(gameId);
        }

        const { rows: response } = await connection.query(
            `SELECT * FROM rentals ${postgresQuery}`, params
        );
        res.status(200).send(response);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function createRentals(req, res) {
    const { id } = req.params;

    try {
        const { rows: response } = await connection.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );

        if(!response[0]) {
            res.sendStatus(404);
            return;
        }

        res.status(200).send(response);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function finishRentals(req, res) {
    const { name, phone, cpf, birthday } = res.locals.newCustomer;

    try {
        await connection.query(
            'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', 
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function deleteRentals(req, res) {
    const { name, phone, cpf, birthday } = res.locals.customer;
    const { id } = req.params;

    try {
        await connection.query(
            'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', 
            [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export {
    createRentals,
    getRentals,
    finishRentals,
    deleteRentals
}