import { Router } from 'express';
import { NameClass } from './app.context';

export default abstract class RouterBase implements NameClass {
  private router: Router;
  constructor() {
    this.router = Router();
    this.config(this.router);
  }
  abstract getName(): string;
  public getRouter(): Router {
    return this.router;
  }
  protected abstract config(router: Router): void;
}
