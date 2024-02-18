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

  public createTokenKeyPair(userId: string, name: string, email: string) {
    const { privateKey, publicKey } = this.generateKeyPair();
    //create access token
    const accessToken = JWT.sign({ userId, name, email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30m',
    });
    //create refresh token
    const refreshToken = JWT.sign({ userId, name, email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });
    return { publicKey, accessToken, refreshToken };
  }

  public verifyToken(token: string, publicKey: string) {
    let decoded;
    try {
      decoded = JWT.verify(token, publicKey) as {
        userId: string;
        name: string;
        email: string;
      };
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, (error as ApiError).message);
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
      ) as { userId: string };
      if (clientId !== decoded.userId)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpStatus[httpStatus.BAD_REQUEST]
        );
      let auth = req.session.auth;
      if (auth) {
        auth.keyStore = {
          user: key.user?.toString(),
          publicKey: key.publicKey,
          refreshToken: key.refreshToken,
          refreshTokensUsed: key.refreshTokensUsed,
        } as IKeyStore;
      } else {
        auth = {
          keyStore: key as unknown as IKeyStore,
          apikey: new Object() as IApiKey,
        };
      }
      return next();
    }
  );
}

const authUtil = getBeanContext<Authentication>(
  Authentication,
  () => new Authentication()
);
export { authUtil };
