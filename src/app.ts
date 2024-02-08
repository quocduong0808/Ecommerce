import morgan from 'morgan';
import express, { Application } from 'express';
import { default as helmet } from 'helmet';
import compression from 'compression';
import { database } from './dbs/init.mongodb';
import { monitorOverhead } from './helpers/system.helper';
import { rootRouter } from './routers/router';
import { NameClass, getBeanContext } from './commons/AppContext';

class App implements NameClass {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
  }
  getName(): string {
    return 'Application';
  }

  private config() {
    //init middlewares
    this.app = express();
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(compression());
    //init db
    database;
    monitorOverhead();
    //init routers
    this.app.use('/', rootRouter.getRouter());
    // this.app.get('/', (req, res) => {
    //   return res.status(200).json({
    //     message: 'Welcome ecommerce service',
    //   });
    // });
    //handling error
  }

  public get(): Application {
    return this.app;
  }
}

const app = getBeanContext<App>(App, () => new App());
export { app };
