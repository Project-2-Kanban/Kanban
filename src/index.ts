import express, { Express } from "express";
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from "cookie-parser";
import routes from './routes/routes';

dotenv.config({path:path.resolve(__dirname,'../.env')});

const app:Express = express();

const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));


app.use(express.json());
app.use(cookieParser()); 

app.use('/api', routes);

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});
