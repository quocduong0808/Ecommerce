import mongoose from 'mongoose';
import { app } from './src/app';
import { AppConfig } from './src/configs/app.config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
//init environment
//console.log('Process: ', process.env);
AppConfig.loadConfig();
const PORT = AppConfig.ENV.APP.PORT;
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
