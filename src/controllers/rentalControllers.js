import dayjs from "dayjs";
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
    const { gameId, customerId, daysRented  } = res.locals.newRental;

    try {
        //Procurando todos os jogos alugados desse ID
        const { rows: rentals } = await connection.query(
            'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL',
            [gameId]
        );

        //Procurando todos os jogos desse ID
        const checkGame = await connection.query(
            'SELECT * FROM games WHERE id = $1', [gameId]
        );

        //Comparando para ver se existe disponível
        if (rentals.rowCount === checkGame.rows[0].stockTotal) {
            res.sendStatus(400);
            return;
        }

        const returnDate = null, delayFee = null;
        const rentDate = dayjs().format('YYYY-MM-DD');
        const originalPrice = checkGame.rows[0].pricePerDay * daysRented;

        const { rows: response } = await connection.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );

        res.sendStatus(201);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function finishRentals(req, res) {
    const { id } = req.params;
    let delayFee = 0;

    try {
        const rental = await connection.query(
            'SELECT * FROM rentals WHERE id = $1', 
            [id]
        );

        if(rental.rowCount === 0) {
            res.sendStatus(404);
            return;
        }

        //Já devolvido
        if(rental.rows[0].returnDate !== null) {
            res.sendStatus(400);
            return;
        }

        const rentGame = await connection.query(
            'SELECT * FROM games WHERE id = $1',
            [rental.rows[0].gameId]
        );

        const returnDate = dayjs().format('YYYY-MM-DD');

        const late = dayjs().diff(rental.rows[0].rentDate, 'day');

        if(late > rental.rows[0].daysRented) {
            delayFee = late * rentGame.rows[0].pricePerDay
        }

        //atualizando a locação no DB
        await connection.query(
            'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3',
            [returnDate, delayFee, id]
        );

        res.sendStatus(200);
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