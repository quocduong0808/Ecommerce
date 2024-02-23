import { Request, Response } from 'express';
import { AppConst } from '../../commons/constans';
import { StatusCodes } from 'http-status-codes';
import { homeService } from '../../services/home.service';
import { NameClass, getBeanContext } from '../../commons/app.context';
import httpStatus from 'http-status';
import { IShop } from '../../dtos/shop.dto';
import ApiRes from '../../models/apiRes.model';
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
  async refreshToken(req: Request, res: Response) {
    const userId = req.headers[AppConst.HEADER.CLIENT_ID];
    const accessTokenIn = req.headers[AppConst.HEADER.AUTHORIZATION];
    const result = await homeService.refreshToken(
      userId?.toString() || '',
      accessTokenIn?.toString() || ''
    );
    return res
      .status(httpStatus.OK)
      .send(new ApiRes(httpStatus.OK, AppConst.HOME.WELCOME, result));
  }
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const userId = req.headers[AppConst.HEADER.CLIENT_ID];
    const accessTokenIn = req.headers[AppConst.HEADER.AUTHORIZATION];
    const result = await homeService.login(
      email,
      password,
      accessTokenIn?.toString(),
      userId?.toString()
    );
    return res
      .status(httpStatus.OK)
      .send(new ApiRes(httpStatus.OK, AppConst.HOME.WELCOME, result));
  }
  async logout(req: Request, res: Response) {
    const id = req.session.auth?.keyStore.user || '';
    const result = await homeService.logout(id);
    return res
      .status(httpStatus.OK)
      .send(
        new ApiRes(httpStatus.OK, AppConst.HOME.LOGOUT.LOGOUT_SUCCESS, result)
      );
  }
  async signup(req: Request, res: Response) {
    const signUp = req.body as IShop;
    const result = await homeService.signUp(
      signUp.name || '',
      signUp.email,
      signUp.password || ''
    );
    return res
      .status(httpStatus.OK)
      .send(new ApiRes(httpStatus.OK, AppConst.HOME.SIGN_UP.SUCCESS, result));
  }
}

const homeController = getBeanContext<HomeController>(
  HomeController,
  () => new HomeController()
);
export { homeController };
