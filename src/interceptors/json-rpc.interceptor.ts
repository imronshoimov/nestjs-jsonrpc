import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import {
  UserInRequest,
  UserInRequestDocument,
} from '../models/schemas/user_in_req_log.schema';

@Injectable()
export class JsonRpcInterceptor implements NestInterceptor {
  private logger = new Logger(JsonRpcInterceptor.name);

  constructor(
    @InjectModel(UserInRequest.name)
    private userInRequestModel: Model<UserInRequestDocument>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method, body, headers } = request;
    let { ip } = request;
    if (headers.hasOwnProperty('x-real-ip')) {
      ip = headers['x-real-ip'].toString();
    }

    return next.handle().pipe(
      tap({
        next: async (data) => {
          this.logger.debug('START');
          try {
            const createUserInRequestDto = new UserInRequest();
            createUserInRequestDto.timestamp = requestTime;
            createUserInRequestDto.date =
              moment(requestTime).format('DD.MM.YYYY H:mm:ss');
            createUserInRequestDto.reqID = body.jsonRpcRequestId;
            createUserInRequestDto.method = method;
            createUserInRequestDto.url = originalUrl;
            createUserInRequestDto.ip = ip;
            createUserInRequestDto.initiator = body.jsonRpcAgentLogin;
            createUserInRequestDto.req_headers = headers;
            createUserInRequestDto.req_body = body;
            createUserInRequestDto.res_status = statusCode;
            createUserInRequestDto.res_body = data;
            createUserInRequestDto.res_time = Date.now() - requestTime;

            const userInRequest = await this.userInRequestModel.create(
              createUserInRequestDto,
            );
            await userInRequest.save();
          } catch (error) {
            if (error.code === 11000) {
              //this.logger.debug('DUPLICATE');
              return;
            }
            this.logger.error(error);
          }
        },
        error: async (error) => {
          this.logger.debug('START');
          try {
            const createUserInRequestDto = new UserInRequest();
            createUserInRequestDto.timestamp = requestTime;
            createUserInRequestDto.date =
              moment(requestTime).format('DD.MM.YYYY H:mm:ss');
            createUserInRequestDto.reqID = body.jsonRpcRequestId;
            createUserInRequestDto.method = method;
            createUserInRequestDto.url = originalUrl;
            createUserInRequestDto.ip = ip;
            createUserInRequestDto.initiator = body.jsonRpcAgentLogin;
            createUserInRequestDto.req_headers = headers;
            createUserInRequestDto.req_body = body;
            createUserInRequestDto.res_status = statusCode;
            createUserInRequestDto.res_body = error;
            createUserInRequestDto.res_time = Date.now() - requestTime;

            const userInRequest = await this.userInRequestModel.create(
              createUserInRequestDto,
            );
            await userInRequest.save();
          } catch (error) {
            if (error.code === 11000) {
              //this.logger.debug('DUPLICATE');
              return;
            }
            this.logger.error(error);
          }
        },
      }),
    );
  }
}
/*
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
*/
