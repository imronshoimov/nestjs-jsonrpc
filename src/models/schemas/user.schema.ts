import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { model, Document, ObjectId, Types, SchemaTypes } from 'mongoose';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  _id: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, required: true, default: Date.now() })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number })
  deleted_at: number;
}

const collectionName = 'USER';
export const UserSchema = SchemaFactory.createForClass(User);
export const UserModelDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
  collection: collectionName,
};
model(User.name, UserSchema, collectionName);
