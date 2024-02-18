import mongoose from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import ApiError from '../commons/api.error';

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
      const err = error as ApiError;
      if (err.errorWithCommit) {
        console.error('Commit transaction with error::::');
        await session.commitTransaction();
      } else {
        console.error('Rollback transaction error::::');
        await session.abortTransaction();
      }
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
