import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { model, Document, ObjectId } from 'mongoose';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';

export type UserInRequestDocument = UserInRequest & Document;

@Schema({ versionKey: false })
export class UserInRequest {
  _id: ObjectId;

  @Prop({ type: Number, required: true, default: Date.now() })
  timestamp: number;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({ type: String, required: true })
  reqID: string;

  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: Object })
  query: object;

  @Prop({ type: Object })
  params: object;

  @Prop({ type: Object, required: true })
  req_headers: object;

  @Prop({ type: Object })
  req_body: object;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  initiator: string;

  @Prop({ type: Object })
  res_headers: object;

  @Prop({ type: String })
  res_status: string;

  @Prop({ type: Object })
  res_body: object;

  @Prop({ type: Number })
  res_time: number;

  @Prop({ type: Object })
  meta: object;
}

const collectionName = 'USER_IN_REQUESTS';
export const UserInRequestSchema = SchemaFactory.createForClass(UserInRequest);
export const UserInRequestDefinition: ModelDefinition = {
  name: UserInRequest.name,
  schema: UserInRequestSchema,
  collection: collectionName,
};
model(UserInRequest.name, UserInRequestSchema, collectionName);
