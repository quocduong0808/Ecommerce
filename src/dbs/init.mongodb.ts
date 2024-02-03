import mongoose from 'mongoose';
import { countMongoseCon } from '../helpers/system.helper';

export class Database {
  private static instance: Database;
  constructor() {
    this.connect();
  }
  private connect(): void {
    const uri = 'mongodb://localhost:27017/ecommerce'; // Replace with your MongoDB URI
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

  public static getInstance(): Database {
    if (this.instance === undefined) {
      this.instance = new Database();
    }
    return this.instance;
  }
}
