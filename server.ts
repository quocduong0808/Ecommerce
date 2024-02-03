import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
//require('dotenv').config();
import dotenv from 'dotenv';
import express, { Application } from 'express';
import AppConfig from './src/configs/app.config';
import App from './src/app';
//init environment
//console.log('Process: ', process.env);
dotenv.config();
AppConfig.loadConfig();
const PORT = AppConfig.ENV.APP.PORT;
const app: Application = express();
App.initApp(app);
const server = app.listen(PORT, () => {
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
