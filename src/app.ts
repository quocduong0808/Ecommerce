import morgan from 'morgan';
import express, { Application, Request, Response, NextFunction } from 'express';
import { default as helmet } from 'helmet';
import compression from 'compression';
import { database } from './dbs/init.mongodb';
import { monitorOverhead } from './helpers/system.helper';
import { rootRouter } from './routers/router';
import { NameClass, getBeanContext } from './commons/app.context';
import ExpressSession from 'express-session';
import ApiRes from './models/apiRes.model';
import httpStatus from 'http-status';
import ApiError from './commons/api.error';

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
    this.app.use(
      ExpressSession({
        secret: 'i-love-husky',
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
    //init db
    database;
    monitorOverhead();
    //init routers
    this.app.use('/', rootRouter.getRouter());

    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(
        new ApiError(httpStatus.NOT_FOUND, `Can't find Url: ${req.originalUrl}`)
      );
    });
    //handling error
    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(error);
        const code = error instanceof ApiError ? error.code : undefined;
        const status =
          error instanceof ApiError
            ? error.status
            : httpStatus.INTERNAL_SERVER_ERROR;
        const message =
          error instanceof ApiError
            ? error.message
            : httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        return res.status(status).send(new ApiRes(code || status, message));
      }
    );
  }

  public get(): Application {
    return this.app;
  }
}

const app = getBeanContext<App>(App, () => new App());
export { app };
