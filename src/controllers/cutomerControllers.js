import dayjs from "dayjs";
import connection from "../db/postgresStrategy.js";

async function getCustomers(req, res) {
    const { cpf } = req.query;

    try {
        if(cpf) {
            const { rows: customerWithQuery } = await connection.query(
                `SELECT * FROM customers WHERE cpf LIKE $1 || '%'`,
                [cpf]
            );

            res.status(200).send(customerWithQuery);
            return;
        }

        const { rows: allCustomers } = await connection.query(
            'SELECT * FROM customers'
        );
        res.status(200).send(allCustomers);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function getCustomer(req, res) {
    const { id } = req.params;

    try {
        const { rows: customer } = await connection.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );

        if(!customer[0]) {
            res.sendStatus(404);
            return;
        }

        customer[0] = {...customer[0], birthday: dayjs(customer[0].birthday).format('YYYY-MM-DD')} 

        res.status(200).send(customer[0]);
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function createCustomer(req, res) {
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

async function updateCustomer(req, res) {
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
    getCustomer,
    getCustomers,
    createCustomer,
    updateCustomer
}