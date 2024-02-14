import { NameClass, getBeanContext } from '../commons/app.context';
import { apiKeyModel } from '../models/apikey.model';

class ApiKeyRepo implements NameClass {
  getName(): string {
    return 'ApiKeyRepo';
  }
  public async findApiByKeyActive(key: string | undefined) {
    return await apiKeyModel
      .findOne({
        key: key,
        status: true,
      })
      .lean();
  }
}

const apiKeyRepo = getBeanContext<ApiKeyRepo>(
  ApiKeyRepo,
  () => new ApiKeyRepo()
);
export { apiKeyRepo };
