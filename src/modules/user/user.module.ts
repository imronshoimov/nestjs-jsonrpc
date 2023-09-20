import { Model, Types, ObjectId } from 'mongoose';
import { Logger, Module } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelDefinition,
} from '../../models/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [MongooseModule.forFeature([UserModelDefinition])],
  controllers: [],
  providers: [],
})
export class UserModule {
  private logger = new Logger(UserModule.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getById(id: string | ObjectId): Promise<UserDocument> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;

    return this.userModel.findOne({ _id: objectId });
  }

  async create(
    name: string,
    login: string,
    password: string,
  ): Promise<UserDocument> {
    return this.userModel.create({ name, login, password });
  }

  async getActiveById(id: string): Promise<UserDocument> {
    const user = await this.getById(id);
    if (!user) {
      throw new Error('Error');
    }

    return user;
  }
}
