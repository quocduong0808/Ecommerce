import { NameClass, getBeanContext } from '../commons/app.context';
import { AppConst } from '../commons/constans';
import ApiRes from '../models/ApiRes.model';
import { shop } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { keyTokenService } from './keytoken.service';
import { authUtil } from '../auth/auth.util';
import ApiError from '../commons/api.error';
import { convertUtil } from '../utils/convert.util';

export default class HomeService implements NameClass {
  constructor() {}
  getName(): string {
    return 'HomeService';
  }
  public async signUp(name: string, email: string, password: string) {
    try {
      //check shop if exist
      const shopHolder = await shop
        .findOne({ name: name, email: email })
        .lean();
      if (shopHolder) {
        throw new ApiError('', AppConst.HOME.SIGN_UP.SHOP_EXISTED_ERROR);
      }
      //encrypt password
      const passwordEnctypt = await bcrypt.hash(password, 10);
      //create new shop
      const newShop = await shop.create({
        name: name,
        email: email,
        password: passwordEnctypt,
        roles: [AppConst.PRIVILEGE.SHOP],
      });
      if (newShop) {
        //if shop is created, gennerate access token and refresh token
        //create private key and public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });
        let tokens;
        if (
          await keyTokenService.createToken(
            newShop._id.toString(),
            publicKey.toString()
          )
        ) {
          const privateKeyObject = crypto.createPrivateKey(privateKey);
          tokens = authUtil.createTokenKeyPair(
            newShop._id.toString(),
            privateKeyObject
          );
          if (tokens) {
            return new ApiRes(
              AppConst.HTTP.CODE.SUCCESS,
              AppConst.HTTP.STATUS.SUCCESS,
              AppConst.HOME.SIGN_UP.SUCCESS,
              {
                tokens,
                shop: convertUtil.getInfosData(
                  ['_id', 'name', 'email'],
                  newShop
                ),
              }
            );
          } else {
            throw new ApiError('', AppConst.HOME.SIGN_UP.CREATE_TOKEN_ERROR);
          }
        }
      } else {
        throw new ApiError('', AppConst.HOME.SIGN_UP.CREATE_SHOP_ERROR);
      }
    } catch (error) {
      console.error(error);
      return new ApiRes(
        AppConst.HTTP.CODE.ERROR,
        AppConst.HTTP.STATUS.ERROR,
        error instanceof ApiError
          ? error.message
          : AppConst.HOME.SIGN_UP.REGISTRATION_ERROR
      );
    } finally {
      //
    }
  }
}

const homeService = getBeanContext<HomeService>(
  HomeService,
  () => new HomeService()
);
export { homeService };
