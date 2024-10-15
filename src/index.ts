import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

import userTypeDefs from './typeDefs/userTypeDefs';
import postTypeDefs from './typeDefs/postTypeDefs';
import userResolvers from './resolvers/userResolvers';
import postResolvers from './resolvers/postResolvers';
import connectToDb from './db/dbConnect';
import cors from 'cors';

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  // Connect to MongoDB
  await connectToDb();

  // Combine your typeDefs and resolvers into a schema
  const schema = makeExecutableSchema({
    typeDefs: [userTypeDefs, postTypeDefs],
    resolvers: [userResolvers, postResolvers],
  });

  // Create WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Set up the WebSocket server using graphql-ws
  const serverCleanup = useServer({
    schema,
    onConnect: (ctx) => {
      console.log('Client connected');
    },
    onDisconnect: (ctx) => {
      console.log('Client disconnected');
    },
    onSubscribe: (ctx, msg) => {
      console.log('Subscription requested:', msg);
    },
    onNext: (ctx, msg, args, result) => {
      console.log('Next:', result);
    },
    onError: (ctx, msg, errors) => {
      console.error('Subscription error:', errors);
    },
    onComplete: (ctx, msg) => {
      console.log('Subscription completed');
    },
    connectionInitWaitTimeout: 10000, // Increase timeout to 10 seconds
  }, wsServer);

  // Create Apollo Server instance
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // Start Apollo Server
  await server.start();

  // Middleware for Apollo Server
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  // Start the server
  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket is available at ws://localhost:${PORT}/graphql`);
  });
};

startServer().catch(console.error);