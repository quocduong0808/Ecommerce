import { Request, Response } from 'express';
import { AppConst } from '../../commons/constans';
import { StatusCodes } from 'http-status-codes';
import { homeService } from '../../services/home.service';
import { NameClass, getBeanContext } from '../../commons/app.context';
import ShopDto from '../../dtos/shop.dto';
import httpStatus from 'http-status';
class HomeController implements NameClass {
  getName(): string {
    return 'HomeController';
  }
  async home(req: Request, res: Response) {
    return res.status(StatusCodes.OK).json({
      code: AppConst.HTTP.CODE.SUCCESS,
      metadata: AppConst.HOME.WELCOME,
    });
  }
  async signup(req: Request, res: Response) {
    const signUp = req.body as ShopDto;
    const result = await homeService.signUp(
      signUp.name,
      signUp.email,
      signUp.password
    );
    console.log('here' + JSON.stringify(result));
    return res.status(httpStatus.OK).send(result);
  }
}

const homeController = getBeanContext<HomeController>(
  HomeController,
  () => new HomeController()
);
export { homeController };
