import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import * as Config from './config';
import { UserModelDefinition } from './models/schemas/user.schema';
import { JsonRpcModule } from 'nestjs-json-rpc-httpstatus';
import { JsonRpcUserModule } from './json-rpc/user/user.module';
import { UserModule } from './modules/user/user.module';
import { UserInRequestDefinition } from './models/schemas/user_in_req_log.schema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JsonRpcInterceptor } from './interceptors/json-rpc.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(Config.Database.dbUri),
    MongooseModule.forFeature([UserModelDefinition, UserInRequestDefinition]),

    JsonRpcModule.forRoot({
      path: '/api/jsonrpc',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JsonRpcUserModule, UserModule],
})
export class AppModule {}
