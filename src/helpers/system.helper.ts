import mongoose from 'mongoose';
import os from 'os';

export function countMongoseCon(): void {
  const nums = mongoose.connections.length;
  console.log(`Number of connections: ${nums}`);
}

export function monitorOverhead(): void {
  const INTERVAL = 5000;
  const maxThreadPerCor = 4;
  setInterval(() => {
    const numCons = mongoose.connections.length;
    const numCors = os.cpus().length;
    const maxCons = numCors * maxThreadPerCor;
    //console.log(`Memory usage: ${process.memoryUsage().rss / 1024 / 1024} Mb`);
    if (numCons > maxCons) {
      console.log(
        `CPU is overhead - Num Connections: ${numCons} - Max Connections ${maxCons}`
      );
    }
  }, INTERVAL); // monitor for each 5 seconds
}
