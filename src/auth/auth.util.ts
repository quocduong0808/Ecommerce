import { NameClass, getBeanContext } from '../commons/app.context';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

class Authentication implements NameClass {
  getName(): string {
    return 'Authentication';
  }
  public createTokenKeyPair(userId: string, privateKey: crypto.KeyObject) {
    //create access token
    const accessToken = JWT.sign({ userId: userId }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30m',
    });
    //create refresh token
    const refrestToken = JWT.sign({ userId: userId }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });
    return { accessToken, refrestToken };
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
