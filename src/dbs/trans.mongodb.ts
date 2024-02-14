import mongoose from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';

class Transactional implements NameClass {
  getName(): string {
    return 'Transactional';
  }
  public async withTransaction(
    session: mongoose.ClientSession,
    onExecute: () => Promise<object>
  ) {
    try {
      await session.startTransaction();
      console.log('Start transaction::::');
      const result = await onExecute();
      console.log('Commit transaction::::');
      await session.commitTransaction();
      return result;
    } catch (error) {
      console.error('Rollback transaction error::::');
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

const transactional = getBeanContext<Transactional>(
  Transactional,
  () => new Transactional()
);
export { transactional };
