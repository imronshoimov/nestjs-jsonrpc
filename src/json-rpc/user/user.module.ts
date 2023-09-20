import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JsonRpcGuard } from '../../guards/json-rpc.guard';
import { JsonRpcInterceptor } from '../../interceptors/json-rpc.interceptor';
import { UserModule } from '../../modules/user/user.module';
import { JsonRpcRequestId } from '../../decorators/json-rpc/request-id.decorator';
import { EJsonRpcUserMethods } from './constants';
import {
  RpcHandler,
  RpcId,
  RpcMethod,
  RpcMethodHandler,
  RpcPayload,
  RpcVersion,
} from 'nestjs-json-rpc-httpstatus';

@Module({
  imports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: JsonRpcInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JsonRpcGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
@RpcHandler({
  method: 'user',
})
@UseInterceptors(JsonRpcInterceptor)
@UseGuards(JsonRpcGuard)
export class JsonRpcUserModule {
  private logger = new Logger(JsonRpcUserModule.name);

  constructor(private readonly userModule: UserModule) {}

  @RpcMethodHandler(EJsonRpcUserMethods.AddUser)
  public async addUser(
    @RpcPayload() params: any,
    @RpcVersion() version: string,
    @RpcId() id: number | string,
    @RpcMethod() method: string,
    @JsonRpcRequestId() requestId,
  ) {
    console.log(params);

    await this.userModule.create(params.name, params.login, params.password);

    return 'ok';
  }
}
