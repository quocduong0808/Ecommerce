import { ClientSession, startSession } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { transactional } from '../dbs/trans.mongodb';
import { keyTokenRepo } from '../repos/keytoken.repo';
import ApiError from '../commons/api.error';
import httpStatus from 'http-status';
import { AppConst } from '../commons/constans';
import { authUtil } from '../auth/auth.util';

class KeyTokenService implements NameClass {
  getName(): string {
    return 'KeyTokenService';
  }
  public async refreshToken(
    userId: string,
    refreshToken: string,
    sessionIn?: ClientSession
  ) {
    let session: ClientSession;
    let result;
    const exec = async (session: ClientSession) => {
      //1. get key model by user id
      const key = await keyTokenRepo.findKeyByUserId(userId);
      if (!key)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpStatus[httpStatus.BAD_REQUEST]
        );
      if (key.refreshTokensUsed?.includes(refreshToken)) {
        //2. if refresh token is used, delete all token and force throw exception
        await keyTokenRepo.removeKeyByUserId(userId, session);
        throw new ApiError(
          httpStatus.FORBIDDEN,
          AppConst.AUTH.TOKEN_SECURITY_ERROR,
          true
        );
      }
      const decoded = authUtil.verifyToken(refreshToken, key.publicKey || '');
      if (key.refreshToken !== refreshToken || decoded.userId !== userId) {
        //3. if token is invalid throw error
        throw new ApiError(
          httpStatus.FORBIDDEN,
          httpStatus[httpStatus.FORBIDDEN]
        );
      }
      //4. if refresh token is exist, generate new pair token and return
      const tokens = authUtil.createTokenKeyPair(
        userId,
        decoded.name,
        decoded.email
      );
      await keyTokenRepo.createOrUpdate(
        userId,
        tokens.publicKey,
        tokens.refreshToken,
        [refreshToken, ...key.refreshTokensUsed],
        session
      );
      return {
        shop: {
          id: userId,
          name: decoded.name,
          email: decoded.email,
        },
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
      };
    };
    if (sessionIn) {
      result = await exec(sessionIn);
    } else {
      session = await startSession();
      result = await transactional.withTransaction(session, async () => {
        return await exec(session);
      });
    }
    return result;
  }
}

const keyTokenService = getBeanContext<KeyTokenService>(
  KeyTokenService,
  () => new KeyTokenService()
);
export { keyTokenService };
