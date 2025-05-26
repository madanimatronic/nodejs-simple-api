import { UserModel } from '@/db/models/user-model';
import {
  ExtendedIncomingMessage,
  ExtendedServerResponse,
} from '@/http-server/types';

class UserController {
  async getUsers(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      let users = [];
      if (req.query.points) {
        users = await UserModel.find({ points: req.query.points });
      } else {
        users = await UserModel.find();
      }
      res.send(users);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async getUser(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      const id = Number(req.params.id);
      const user = await UserModel.findOne({ id: id });
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.send(user);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async createUser(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      const user = new UserModel(req.body);
      await user.save();
      res.send(user);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async updateUser(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      const id = Number(req.params.id);
      const updatedUser = await UserModel.findOneAndUpdate(
        { id: id },
        req.body,
        {
          new: true,
        },
      );

      if (!updatedUser) {
        return res.status(500).send({ error: 'User update failed' });
      }

      res.send(updatedUser);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async deleteUser(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      const id = Number(req.params.id);
      const deletedUser = await UserModel.findOneAndDelete({ id: id });
      if (!deletedUser) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.send(deletedUser);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

export const userController = new UserController();
