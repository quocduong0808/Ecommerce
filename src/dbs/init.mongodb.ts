import mongoose from 'mongoose';
import { countMongoseCon } from '../helpers/system.helper';
import AppConfig from '../configs/app.config';
import { NameClass, getBeanContext } from '../commons/app.context';

class Database implements NameClass {
  constructor() {
    this.connect();
  }
  getName(): string {
    return 'Database';
  }
  private connect(): void {
    const uri = `mongodb://${AppConfig.ENV.DB.HOST}:${AppConfig.ENV.DB.PORT},${AppConfig.ENV.DB.HOST}:27019,${AppConfig.ENV.DB.HOST}:27020/${AppConfig.ENV.DB.NAME}?replicaSet=${AppConfig.ENV.DB.REPLSET}`; // Replace with your MongoDB URI
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
    mongoose
      .connect(uri, {
        maxPoolSize: 10,
      })
      .then(() => {
        console.log(`Connect Mongoose successfully`);
        countMongoseCon();
      })
      .catch((error) => {
        console.log('Error connect mongoose db...');
        throw error;
      });
  }
}

const database = getBeanContext<Database>(Database, () => new Database());
export { database };
