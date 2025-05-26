import { userController } from '@/controllers/UserController';
import { Router } from '@/http-server/Router';

export const userRouter = new Router();

userRouter.get('/users', userController.getUsers);

userRouter.get('/users/:id', userController.getUser);

userRouter.post('/users', userController.createUser);

userRouter.put('/users/:id', userController.updateUser);

userRouter.delete('/users/:id', userController.deleteUser);
