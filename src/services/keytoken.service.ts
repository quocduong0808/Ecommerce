import { NameClass, getBeanContext } from '../commons/app.context';
import { keyModel } from '../models/keystore.model';

class KeyTokenService implements NameClass {
  getName(): string {
    return 'KeyTokenService';
  }

  public async createToken(user: string, publicKey: string) {
    const tokens = await keyModel.create({
      user: user,
      publicKey: publicKey,
    });
    return tokens ? publicKey : null;
  }
}

const keyTokenService = getBeanContext<KeyTokenService>(
  KeyTokenService,
  () => new KeyTokenService()
);
export { keyTokenService };
