import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors"
import express from 'express';
import bodyParser from 'body-parser';
import { User } from './user';

export async function initServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const server = new ApolloServer({
    typeDefs: `
      ${User.types}
      ${User.queries}
    `,
    resolvers: {...User.resolvers},
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));
  return app;
}
