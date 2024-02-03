import morgan from 'morgan';
import express from 'express';
import { default as helmet } from 'helmet';
import compression from 'compression';
import { Database } from './dbs/init.mongodb';
import { monitorOverhead } from './helpers/system.helper';

export const app = express();
//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
//init db
Database.getInstance();
monitorOverhead();
//init routers
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome ecommerce service',
  });
});
//handling error
