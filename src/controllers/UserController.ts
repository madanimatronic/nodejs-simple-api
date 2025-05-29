import {
  ExtendedIncomingMessage,
  ExtendedServerResponse,
} from '@/http-server/types';
import { userService } from '@/services/UserService';

class UserController {
  async getUsers(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      let users = [];
      const queryPoints = req.query.points;

      if (queryPoints) {
        users = await userService.getUsers(Number(queryPoints));
      } else {
        users = await userService.getUsers();
      }
      res.send(users);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async getUser(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      const id = Number(req.params.id || undefined);
      const user = await userService.getUser(id);

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
      const createdUser = await userService.createUser(req.body);
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async updateUser(req: ExtendedIncomingMessage, res: ExtendedServerResponse) {
    try {
      const id = Number(req.params.id || undefined);
      const updatedUser = await userService.updateUser(id, req.body);

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
      const id = Number(req.params.id || undefined);
      const deletedUser = await userService.deleteUser(id);

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
