import 'dotenv/config';
import { startDB } from './db';
import { Server } from './http-server/Server';
import { userRouter } from './routes/user-routes';

const serverProtocol = process.env.SERVER_PROTOCOL;
const serverHost = process.env.SERVER_HOST;
const serverPort = Number(process.env.SERVER_PORT);
const dbConnectionString = process.env.DB_CONNECTION_STRING;

const baseURL = `${serverProtocol}://${serverHost}:${serverPort}`;

if (
  !serverProtocol ||
  !serverHost ||
  isNaN(serverPort) ||
  !dbConnectionString
) {
  throw new Error('Some .env server variables are invalid!');
}

const server = new Server(baseURL);
server.addRouter(userRouter);

const startApp = async () => {
  try {
    console.log('Starting server...');
    await startDB(dbConnectionString, () => {
      console.log('DB started!');
    });

    server.listen(serverPort, () => {
      console.log(`Server started on port ${serverPort}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
