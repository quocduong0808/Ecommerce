import { StatusCodes } from 'http-status-codes';
import { AppConst } from '../commons/constans';
import ApiError from '../commons/api.error';
import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../services/apikey.service';
import { NameClass, getBeanContext } from '../commons/app.context';
import IApiKey from '../dtos/apikey.dto';

class ApiKeyAuth implements NameClass {
  getName(): string {
    return 'ApiKeyAuth';
  }
  public async apiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const apiKey = req?.headers[AppConst.HEADER.API_KEY]?.toString();
      if (!apiKey) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          AppConst.AUTH.APIKEY_NOTFOUND
        );
      }
      const apiKeyObj = await apiKeyService.findApiByKeyActive(apiKey);
      if (!apiKeyObj) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          AppConst.AUTH.APIKEY_NOTFOUND
        );
      } else {
        req.session.auth = {
          user: { email: '' },
          keyStore: { user: '' },
          apikey: apiKeyObj as unknown as IApiKey,
        };
      }
      return next();
    } catch (error) {
      next(error);
    }
  }
  public permission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.session.auth?.apikey.permissions?.includes(permission)) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            AppConst.AUTH.PERMISSION_DENIED
          );
        }
        return next();
      } catch (error) {
        next(error);
      }
    };
  }
}

const apiKeyAuth = getBeanContext<ApiKeyAuth>(
  ApiKeyAuth,
  () => new ApiKeyAuth()
);
export { apiKeyAuth };
