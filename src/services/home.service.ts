import { NameClass, getBeanContext } from '../commons/app.context';
import { AppConst } from '../commons/constans';
import bcrypt from 'bcrypt';
import ApiError from '../commons/api.error';
import { StatusCodes } from 'http-status-codes';
import { authUtil } from '../auth/auth.util';
import { convertUtil } from '../utils/convert.util';
import { transactional } from '../dbs/trans.mongodb';
import { shopRepo } from '../repos/shop.repo';
import { keyTokenRepo } from '../repos/keytoken.repo';
import httpStatus from 'http-status';
import { keyTokenService } from './keytoken.service';

export default class HomeService implements NameClass {
  constructor() {}
  getName(): string {
    return 'HomeService';
  }
  public async refreshToken(userId: string, refreshToken: string) {
    return await keyTokenService.refreshToken(userId, refreshToken);
  }
  public async logout(userId: string) {
    //const session = await startSession();
    const result = await transactional.withTransaction(async (session) => {
      await keyTokenRepo.removeKeyByUserId(userId, session);
      return {};
    });
    return result;
  }
  public async login(
    email: string,
    password: string,
    accessTokenIn?: string | undefined,
    userId?: string | undefined
  ) {
    //const session = await startSession();
    const resutl = await transactional.withTransaction(async (session) => {
      if (!email && !password && accessTokenIn && userId) {
        const key = await keyTokenRepo.findKeyByUserId(userId);
        return authUtil.verifyToken(accessTokenIn, key?.publicKey || '');
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
      const tokens = await authUtil.createTokenKeyPair(
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
        tokens.privateKey,
        tokens.refreshToken,
        undefined,
        session
      );
      return {
        shop: convertUtil.getInfosData(['_id', 'name', 'email'], shopEx),
        tokens: convertUtil.getInfosData(
          ['accessToken', 'refreshToken'],
          tokens
        ),
      };
    });
    return resutl;
  }
  public async signUp(name: string, email: string, password: string) {
    //const session = await startSession();
    const resutl = await transactional.withTransaction(async (session) => {
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
        const { privateKey, publicKey, accessToken, refreshToken } =
          await authUtil.createTokenKeyPair(
            newShop._id.toString(),
            name,
            email
          );
        if (
          publicKey &&
          accessToken &&
          refreshToken &&
          (await keyTokenRepo.createOrUpdate(
            newShop._id.toString(),
            publicKey.toString(),
            privateKey,
            refreshToken,
            undefined,
            session
          ))
        ) {
          return {
            tokens: {
              accessToken,
              refreshToken,
            },
            shop: convertUtil.getInfosData(['_id', 'name', 'email'], newShop),
          };
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
