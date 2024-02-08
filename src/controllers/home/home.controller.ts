import { NextFunction, Request, Response } from 'express';
import { AppConst } from '../../commons/constans';
import { StatusCodes } from 'http-status-codes';
import { homeService } from '../../services/home.service';
import { NameClass, getBeanContext } from '../../commons/AppContext';
class HomeController implements NameClass {
  getName(): string {
    return 'HomeController';
  }
  async home(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(StatusCodes.OK).json({
        code: AppConst.HTTP.CODE.SUCCESS,
        metadata: AppConst.HOME.WELCOME,
      });
    } catch (err) {
      next(err);
    }
  }
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await homeService.signUp(
        'shop_1',
        'shop1@email.com',
        '1234567'
      );
      console.log('here' + JSON.stringify(result));
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
}

const homeController = getBeanContext<HomeController>(
  HomeController,
  () => new HomeController()
);
export { homeController };
