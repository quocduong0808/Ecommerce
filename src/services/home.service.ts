import { NameClass, getBeanContext } from '../commons/AppContext';
import { AppConst } from '../commons/constans';
import ApiRes from '../models/ApiRes.model';
import { shop } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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
        return new ApiRes(
          AppConst.HTTP.CODE.ERROR,
          AppConst.HTTP.STATUS.ERROR,
          AppConst.HOME.SIGN_UP.SHOP_EXISTED_ERROR
        );
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
        });
        console.log(privateKey + '-' + publicKey);
      }
    } catch (error) {
      return new ApiRes(
        AppConst.HTTP.CODE.ERROR,
        AppConst.HTTP.STATUS.ERROR,
        AppConst.HOME.SIGN_UP.REGISTRATION_ERROR
      );
    }
  }
}

const homeService = getBeanContext<HomeService>(
  HomeService,
  () => new HomeService()
);
export { homeService };
