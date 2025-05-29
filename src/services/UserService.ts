import { UserModel } from '@/db/models/user-model';

class UserService {
  async getUsers(points?: number) {
    let users = [];

    if (points !== undefined) {
      users = await UserModel.find({ points: points });
    } else {
      users = await UserModel.find();
    }

    return users;
  }

  async getUser(id: number) {
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      return undefined;
    }
    return user;
  }

  async createUser(userData: any) {
    const user = new UserModel(userData);
    return await user.save();
  }

  async updateUser(id: number, userData: any) {
    return await UserModel.findOneAndUpdate({ id: id }, userData, {
      new: true,
    });
  }

  async deleteUser(id: number) {
    return await UserModel.findOneAndDelete({ id: id });
  }
}

export const userService = new UserService();
