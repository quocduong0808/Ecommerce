import { NameClass, getBeanContext } from '../commons/app.context';

class KeyTokenRepo implements NameClass {
  getName(): string {
    return 'KeyTokenRepo';
  }
}

const keyTokenRepo = getBeanContext<KeyTokenRepo>(
  KeyTokenRepo,
  () => new KeyTokenRepo()
);
export { keyTokenRepo };
