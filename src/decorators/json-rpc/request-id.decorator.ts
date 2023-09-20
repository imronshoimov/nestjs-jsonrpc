import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JsonRpcRequestId = createParamDecorator(function (
  data: string,
  ctx: ExecutionContext,
) {
  const request = ctx.switchToHttp().getRequest();
  return request?.body?.jsonRpcRequestId;
});
