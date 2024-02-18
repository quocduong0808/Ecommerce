import { NameClass, getBeanContext } from '../commons/app.context';
import { AppConst } from '../commons/constans';
import bcrypt from 'bcrypt';
import ApiError from '../commons/api.error';
import { StatusCodes } from 'http-status-codes';
import { authUtil } from '../auth/auth.util';
import { convertUtil } from '../utils/convert.util';
import ApiRes from '../models/apiRes.model';
import { transactional } from '../dbs/trans.mongodb';
import { startSession } from 'mongoose';
import { shopRepo } from '../repos/shop.repo';
import { keyTokenRepo } from '../repos/keytoken.repo';
import httpStatus from 'http-status';
import { keyTokenService } from './keytoken.service';

export default class HomeService implements NameClass {
  constructor() {}
  getName(): string {
    return 'HomeService';
  }
  public async logout(userId: string) {
    const session = await startSession();
    const result = await transactional.withTransaction(session, async () => {
      await keyTokenRepo.removeKeyByUserId(userId, session);
      return new ApiRes(httpStatus.OK, AppConst.HOME.LOGOUT.LOGOUT_SUCCESS);
    });
    return result;
  }
  public async login(
    email: string,
    password: string,
    refreshToken?: string | undefined,
    userId?: string | undefined
  ) {
    const session = await startSession();
    const resutl = await transactional.withTransaction(session, async () => {
      if (refreshToken) {
        const result = await keyTokenService.refreshToken(
          userId || '',
          refreshToken,
          session
        );
        return new ApiRes(httpStatus.OK, httpStatus[httpStatus.OK], result);
      }
      const shopEx = await shopRepo.findOneByEmail(email);
      if (!shopEx)
        throw new ApiError(httpStatus.UNAUTHORIZED, AppConst.AUTH.SHOP_NOT_REG);
      if (!(await bcrypt.compare(password, shopEx.password || '')))
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          httpStatus[httpStatus.UNAUTHORIZED]
        );
      //generate new token
      const tokens = authUtil.createTokenKeyPair(
        shopEx._id.toString(),
        shopEx.name || '',
        shopEx.email || ''
      );
      if (!tokens)
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          AppConst.HOME.SIGN_UP.CREATE_TOKEN_ERROR
        );
      await keyTokenRepo.createOrUpdate(
        shopEx._id.toString(),
        tokens.publicKey,
        tokens.refreshToken,
        undefined,
        session
      );
      return new ApiRes(httpStatus.OK, httpStatus[httpStatus.OK], {
        shop: convertUtil.getInfosData(['_id', 'name', 'email'], shopEx),
        tokens: convertUtil.getInfosData(
          ['accessToken', 'refreshToken'],
          tokens
        ),
      });
    });
    return resutl;
  }
  public async signUp(name: string, email: string, password: string) {
    const session = await startSession();
    const resutl = await transactional.withTransaction(session, async () => {
      //check shop if exist
      const shopHolder = await shopRepo.findOneByNameAndEmail(name, email);
      if (shopHolder) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          AppConst.HOME.SIGN_UP.SHOP_EXISTED_ERROR
        );
      }
      //encrypt password
      const passwordEnctypt = await bcrypt.hash(password, 10);
      //create new shop
      const newShop = await shopRepo.findOneAndUpdate(
        email,
        name,
        passwordEnctypt,
        [AppConst.PRIVILEGE.SHOP],
        session
      );
      if (newShop) {
        const { publicKey, accessToken, refreshToken } =
          authUtil.createTokenKeyPair(newShop._id.toString(), name, email);
        if (
          publicKey &&
          accessToken &&
          refreshToken &&
          (await keyTokenRepo.createOrUpdate(
            newShop._id.toString(),
            publicKey.toString(),
            refreshToken,
            undefined,
            session
          ))
        ) {
          return new ApiRes(
            AppConst.HTTP.CODE.SUCCESS,
            AppConst.HOME.SIGN_UP.SUCCESS,
            {
              tokens: {
                accessToken,
                refreshToken,
              },
              shop: convertUtil.getInfosData(['_id', 'name', 'email'], newShop),
            }
          );
        } else {
          throw new ApiError(
            StatusCodes.EXPECTATION_FAILED,
            AppConst.HOME.SIGN_UP.CREATE_TOKEN_ERROR
          );
        }
      } else {
        throw new ApiError(
          StatusCodes.EXPECTATION_FAILED,
          AppConst.HOME.SIGN_UP.CREATE_SHOP_ERROR
        );
      }
    });
    return resutl;
  }
}

const homeService = getBeanContext<HomeService>(
  HomeService,
  () => new HomeService()
);
export { homeService };
