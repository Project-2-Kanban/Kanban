import express, { Express } from "express";
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from "cookie-parser";
import routes from './routes/routes';
import cors from 'cors';

dotenv.config({path:path.resolve(__dirname,'../.env')});

const app:Express = express();

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME;

app.use(cors({ origin: hostname, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));


app.use(express.json());
app.use(cookieParser()); 

app.use('/api', routes);

app.listen(port,()=>{
    console.log(`Server running on https://${hostname}:${port}`);
});
