import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import bodyParser from 'body-parser';

export  async function initServer(){
const app = express();
app.use(bodyParser.json())

const server = new ApolloServer({
  typeDefs:`
    type Query {
    sayHello: String
  }
  `,
  resolvers:{
 Query:{ sayHello:()=>"GQL Server"}
  },
});

await server.start();


app.use('/graphql', expressMiddleware(server));
return app
}
