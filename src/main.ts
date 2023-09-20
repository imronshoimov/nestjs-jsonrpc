import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClusterService } from './services/cluster.service';
import * as Config from './config';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  //ENV_VAR=development pm2 restart zplat-gateway --update-env
  //ENV_VAR=production pm2 restart zplat-gateway --update-env

  const app = await NestFactory.create(AppModule, {
    logger: Config.Logger.allLogs
      ? ['log', 'debug', 'error', 'verbose', 'warn']
      : ['log', 'error', 'warn'],
    //logger: ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  //app.useGlobalInterceptors(new GlobalInterceptor());
  //app.useGlobalPipes(new ValidationPipe());
  await app.listen(Config.Server.Port, Config.Server.Host);
}
//Call app_cluster.service.ts here.
ClusterService.clusterize(bootstrap);
