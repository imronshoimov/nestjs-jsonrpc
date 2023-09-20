import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  Module,
} from '@nestjs/common';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Config from '../config';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class JsonRpcGuard implements CanActivate {
  private logger = new Logger(JsonRpcGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    return await this.validateRequest(request);
  }

  private async validateRequest(request: Request): Promise<boolean> {
    let { ip } = request;
    const { headers } = request;

    if (headers.hasOwnProperty('x-real-ip')) {
      ip = headers['x-real-ip'].toString();
    }

    if (!headers.authorization || headers.authorization.length === 0) {
      return false;
    }

    const [authType, authToken]: string[] = headers.authorization.split(' ');
    if (authType === 'Basic') {
      if (!authToken || authToken.length === 0) {
        return false;
      }

      const tokenFromBase64 = Buffer.from(authToken, 'base64').toString('utf8');
      const [login, key] = tokenFromBase64.split(':');

      if (Config.Settings.Login !== login && Config.Settings.Key !== key) {
        return false;
      }

      request.body.jsonRpcRequestId = await uuidv4();
      request.body.jsonRpcRequestIp = ip;

      return true;
    } else if (authType === 'Bearer') {
      return false;
    }

    return false;
  }
}
