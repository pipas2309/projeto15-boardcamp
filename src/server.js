import express, { json } from 'express';
import cors from 'cors';
import 'dotenv/config';

import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
//import customersRouter from './routes/customersRouter.js';
//import rentalsRouter from './routes/rentalsRouter.js';

const PORT = process.env.PORT || 4000;

const server = express();

server.use(cors());
server.use(json());

server.use("/categories", categoriesRouter);
server.use("/games", gamesRouter);
//server.use("/customers", customersRouter);
//server.use("/rentals", rentalsRouter);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
});