import { ClientSession } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { clothingModel } from '../models/clothing.model';
import { IClothing } from '../dtos/clothing.dto';

class ClothingRepo implements NameClass {
  getName(): string {
    return 'ClothingRepo;';
  }
  public async create(clothing: IClothing, session?: ClientSession) {
    return await clothingModel.create(
      [
        {
          ...(clothing as IClothing),
        },
      ],
      {
        session,
      }
    );
  }
}
const clothingRepo = getBeanContext<ClothingRepo>(
  ClothingRepo,
  () => new ClothingRepo()
);

export { clothingRepo };
