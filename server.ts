type AuthType = {
  user: IShop;
  keyStore: IKeyStore;
  apikey: IApiKey;
};

// Augment express-session with a custom SessionData object
declare module 'express-session' {
  interface SessionData {
    auth: AuthType;
  }
}
declare module 'mongoose' {
  interface SessionOption {
    session?: ClientSession | null;
  }
}
import dotenv from 'dotenv';
import AppConfig from './src/configs/app.config';
dotenv.config();
AppConfig.loadConfig();
import mongoose, { ClientSession } from 'mongoose';
import { app } from './src/app';
import IApiKey from './src/dtos/apikey.dto';
import { IKeyStore } from './src/dtos/keystore.dto';
import { IShop } from './src/dtos/shop.dto';
//console.log('Process: ', process.env);
const PORT = AppConfig.ENV.APP.PORT;
const server = app.get().listen(PORT, () => {
  console.log(`Ecommerce server start at port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose
      .disconnect()
      .then(() => {
        console.log(`Disconect mongoose success`);
      })
      .catch((error) => {
        console.log(`Error disconnect mongoose...`);
        throw error;
      });
    console.log(`Exit Ecommerce server`);
  });
});
