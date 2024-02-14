import { NameClass, getBeanContext } from '../commons/app.context';
import { AppConst } from '../commons/constans';
import { shop } from '../models/user.model';
import bcrypt from 'bcrypt';
import ApiError from '../commons/api.error';
import { StatusCodes } from 'http-status-codes';
import { authUtil } from '../auth/auth.util';
import { keyTokenService } from './keytoken.service';
import { convertUtil } from '../utils/convert.util';
import ApiRes from '../models/apiRes.model';
import { transactional } from '../dbs/trans.mongodb';
import { startSession } from 'mongoose';

export default class HomeService implements NameClass {
  constructor() {}
  getName(): string {
    return 'HomeService';
  }
  public async signUp(name: string, email: string, password: string) {
    const session = await startSession();
    const resutl = await transactional.withTransaction(session, async () => {
      //check shop if exist
      const shopHolder = await shop
        .findOne({ name: name, email: email })
        .lean();
      if (shopHolder) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          AppConst.HOME.SIGN_UP.SHOP_EXISTED_ERROR
        );
      }
      //encrypt password
      const passwordEnctypt = await bcrypt.hash(password, 10);
      //create new shop
      const newShop = await shop
        .findOneAndUpdate(
          { email: email },
          {
            $set: {
              name: name,
              email: email,
              password: passwordEnctypt,
              roles: [AppConst.PRIVILEGE.SHOP],
            },
          },
          { upsert: true, new: true, session }
        )
        .lean();
      if (newShop) {
        const { publicKey, accessToken, refreshToken } =
          authUtil.createTokenKeyPair(newShop._id.toString());
        if (
          publicKey &&
          accessToken &&
          refreshToken &&
          (await keyTokenService.createToken(
            newShop._id.toString(),
            publicKey.toString(),
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
