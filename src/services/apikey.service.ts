import { NameClass, getBeanContext } from '../commons/app.context';
import { apiKeyModel } from '../models/apikey.model';

class ApiKeySerivce implements NameClass {
  getName(): string {
    return 'ApiKeySerivce';
  }
  public async findApiByKeyActive(key: string | undefined) {
    const objKey = apiKeyModel
      .findOne({
        key: key,
        status: true,
      })
      .lean();
    return objKey;
  }
}
const apiKeyService = getBeanContext<ApiKeySerivce>(
  ApiKeySerivce,
  () => new ApiKeySerivce()
);
export { apiKeyService };
