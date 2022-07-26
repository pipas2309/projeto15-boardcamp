import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

//const connectionString = process.env.DATABASE_URL; //Alternative URL
const connectionString = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
}

const connection = new Pool(connectionString);

export default connection;