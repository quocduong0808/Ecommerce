import dotenv from 'dotenv';
import AppConfig from './src/configs/app.config';
dotenv.config();
AppConfig.loadConfig();
import mongoose from 'mongoose';
import { app } from './src/app';
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
