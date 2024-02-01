import morgan from 'morgan';
import express from 'express';
import { default as helmet } from 'helmet';
import compression from 'compression';

export const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
//init db

//init router
app.get('/',(req,res,next)=>{
    return res.status(200).json({
        message:'Welcome ecommerce service'
    });
});
//handling error