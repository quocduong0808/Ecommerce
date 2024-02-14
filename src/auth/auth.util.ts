import { NameClass, getBeanContext } from '../commons/app.context';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import AppConfig from '../configs/app.config';

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

  public createTokenKeyPair(userId: string) {
    const { privateKey, publicKey } = this.generateKeyPair();
    //create access token
    const accessToken = JWT.sign({ userId: userId }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30m',
    });
    //create refresh token
    const refreshToken = JWT.sign({ userId: userId }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });
    return { publicKey, accessToken, refreshToken };
  }

  public verifyToken(token: string, publicKey: crypto.KeyObject) {
    const decoded = JWT.verify(token, publicKey);
    return decoded;
  }
}

const authUtil = getBeanContext<Authentication>(
  Authentication,
  () => new Authentication()
);
export { authUtil };
