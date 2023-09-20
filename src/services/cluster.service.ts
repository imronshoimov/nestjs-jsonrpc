import * as cluster from 'cluster';
import * as os from 'os';
import { Injectable } from '@nestjs/common';
import * as Config from '../config';

let numCPUs = os.cpus().length;
if (Config.Cluster.WorkersCount) {
  numCPUs = Config.Cluster.WorkersCount;
}

@Injectable()
export class ClusterService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static clusterize(callback: Function): void {
    if (cluster.isMaster) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker: cluster.Worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
