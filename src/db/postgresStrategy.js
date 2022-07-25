import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const connection = new Pool({
    connectionString
});

export default connection;