import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();
const env = process.env;

export const environment = env.ENVIRONMENT;

export const Logger = {
  allLogs: env.LOGGER_ALL_LOGS === 'true',
};

export const Cluster = {
  WorkersCount: +env.CLUSTER_WORKERS_COUNT || 2,
};

export const Server = {
  Host: env.SERVER_HOST || '127.0.0.1',
  Port: +env.SERVER_PORT || 4050,
};

export const Database = {
  dbUri: env.DB_URI || 'mongodb://localhost:27017/test-nest',
};

export const Settings = {
  Login: env.LOGIN || 'login',
  Key: env.KEY || 'key',
};
