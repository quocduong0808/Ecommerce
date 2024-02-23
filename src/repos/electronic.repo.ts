import { ClientSession } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import { electronicModel } from '../models/electronic.model';
import { IElectronic } from '../dtos/electronic.dto';

class ElectronicRepo implements NameClass {
  getName(): string {
    return 'ElectronicRepo';
  }
  public async create(product: IElectronic, session?: ClientSession) {
    return await electronicModel.create([product], { session });
  }
}
const electronicRepo = getBeanContext<ElectronicRepo>(
  ElectronicRepo,
  () => new ElectronicRepo()
);
export { electronicRepo };
