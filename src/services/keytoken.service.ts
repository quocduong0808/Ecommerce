import { NameClass, getBeanContext } from '../commons/app.context';

class KeyTokenService implements NameClass {
  getName(): string {
    return 'KeyTokenService';
  }
}

const keyTokenService = getBeanContext<KeyTokenService>(
  KeyTokenService,
  () => new KeyTokenService()
);
export { keyTokenService };
