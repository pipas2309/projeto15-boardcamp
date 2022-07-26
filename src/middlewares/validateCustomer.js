import connection from "../db/postgresStrategy.js";
import customerSchema from "../models/joiCustomers.js";

async function validateCustomer (req, res, next) {
    const newCustomer = req.body;

    const id = req.params.id || null;

    const isValidyEntry = customerSchema.validate(newCustomer, { abortEarly: false });

    if(isValidyEntry.error) {
        return res.sendStatus(400);
    }

    //Verifica se existe parametros para o ID, 
    //assim sabe qual rota está sendo solicitada!
    //Nesse caso os dados são tratados para a rota ** PUT /customers/:id ** 
    if(id) {
        try {
            const customer = newCustomer;
            
            const allCategories = await connection.query(
                'SELECT * FROM customers WHERE cpf = $1 AND id <> $2', 
                [customer.cpf, id]
            );
    
            if (allCategories.rowCount === 1) {
                res.status(409).send();
                return;
            }
    
            res.locals.customer = customer;
            
            next();
            return;   

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
            return; 
        }
    }

    //Dados tratados para a rota ** POST /customers **
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

export default validateCustomer;