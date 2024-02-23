import mongoose, { ClientSession, startSession } from 'mongoose';
import { NameClass, getBeanContext } from '../commons/app.context';
import ApiError from '../commons/api.error';

class Transactional implements NameClass {
  getName(): string {
    return 'Transactional';
  }
  public async withTransaction(
    onExe: (session: ClientSession) => Promise<object>,
    session?: mongoose.ClientSession
  ) {
    let result;
    session
      ? (result = await onExe(session))
      : (result = await this.processWithNewTrans(onExe));
    return result;
  }
  private async processWithNewTrans(
    onExe: (session: ClientSession) => Promise<object>
  ) {
    let newSession;
    try {
      newSession = await startSession();
      await newSession.startTransaction();
      console.log('Start transaction::::');
      const result = await onExe(newSession);
      console.log('Commit transaction::::');
      await newSession.commitTransaction();
      return result;
    } catch (error) {
      const err = error as ApiError;
      if (err.errorWithCommit) {
        console.error('Commit transaction with error::::');
        await newSession?.commitTransaction();
      } else {
        console.error('Rollback transaction error::::');
        await newSession?.abortTransaction();
      }
      throw error;
    } finally {
      await newSession?.endSession();
    }
  }
}

const transactional = getBeanContext<Transactional>(
  Transactional,
  () => new Transactional()
);
export { transactional };
