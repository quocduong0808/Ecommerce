import { app } from './src/app';
const PORT = 3055;
const server = app.listen(PORT, () => {
  console.log(`Ecommerce server start at port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log(`Exit Ecommerce server`);
  });
});
