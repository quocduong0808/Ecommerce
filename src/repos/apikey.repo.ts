import { NameClass, getBeanContext } from '../commons/app.context';

class ApiKeyRepo implements NameClass {
  getName(): string {
    return 'ApiKeyRepo';
  }
}

const apiKeyRepo = getBeanContext<ApiKeyRepo>(
  ApiKeyRepo,
  () => new ApiKeyRepo()
);
export { apiKeyRepo };
