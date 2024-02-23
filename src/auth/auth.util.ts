import { NameClass, getBeanContext } from '../commons/app.context';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import AppConfig from '../configs/app.config';
import { asyncHandle } from '../commons/error.handler';
import { Request, Response, NextFunction } from 'express';
import { AppConst } from '../commons/constans';
import ApiError from '../commons/api.error';
import httpStatus from 'http-status';
import { keyTokenRepo } from '../repos/keytoken.repo';
import { IKeyStore } from '../dtos/keystore.dto';
import IApiKey from '../dtos/apikey.dto';
import { IShop } from '../dtos/shop.dto';

class Authentication implements NameClass {
  getName(): string {
    return 'Authentication';
  }

  public generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: AppConfig.ENV.APP.KEY_LENGTH,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
  }

  public async createTokenKeyPair(userId: string, name: string, email: string) {
    const keyFound = await keyTokenRepo.findKeyByUserId(userId);
    const { privateKey, publicKey } =
      keyFound && keyFound.privateKey && keyFound.publicKey
        ? { privateKey: keyFound.privateKey, publicKey: keyFound.publicKey }
        : this.generateKeyPair();
    //create access token
    const accessToken = JWT.sign({ _id: userId, name, email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });
    //create refresh token
    const refreshToken = JWT.sign({ _id: userId, name, email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });
    return { privateKey, publicKey, accessToken, refreshToken };
  }

  public verifyToken(token: string, publicKey: string) {
    let decoded;
    try {
      decoded = JWT.verify(token, publicKey) as {
        _id: string;
        name: string;
        email: string;
      };
    } catch (error) {
      console.error(error);
      if ((error as ApiError).message === AppConst.AUTH.TOKEN_EXPIRE) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          httpStatus[httpStatus.UNAUTHORIZED],
          undefined,
          AppConst.HTTP.CODE.TOKEN_EXPIRE_ERROR
        );
      } else {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          httpStatus[httpStatus.UNAUTHORIZED]
        );
      }
    }
    return decoded;
  }

  public authentication = asyncHandle(
    async (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.headers[AppConst.HEADER.CLIENT_ID];
      const accessToken = req.headers[AppConst.HEADER.AUTHORIZATION];
      if (!clientId || !accessToken)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpStatus[httpStatus.BAD_REQUEST]
        );
      //find key in db
      console.log(clientId);
      const key = await keyTokenRepo.findKeyByUserId(clientId.toString());
      if (!key)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpStatus[httpStatus.BAD_REQUEST]
        );
      const decoded = this.verifyToken(
        accessToken.toString(),
        key.publicKey || ''
      );
      if (clientId !== decoded._id)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpStatus[httpStatus.BAD_REQUEST]
        );
      let auth = req.session.auth;
      if (auth) {
        auth.user = decoded as IShop;
        auth.keyStore = key as unknown as IKeyStore;
      } else {
        auth = {
          user: decoded as IShop,
          keyStore: key as unknown as IKeyStore,
          apikey: new Object() as IApiKey,
        };
      }
      req.session.auth = auth;
      return next();
    }
  );
}

const authUtil = getBeanContext<Authentication>(
  Authentication,
  () => new Authentication()
);
export { authUtil };
