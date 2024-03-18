import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors"
import express from 'express';
import bodyParser from 'body-parser';
import { User } from './user';
import JWT_SERVICE from '../services/jwt';

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

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => ({
      user: req.headers.authorization ? JWT_SERVICE.decodeToken(req.headers.authorization) : undefined
    })
  }));
  
  return app;
}
