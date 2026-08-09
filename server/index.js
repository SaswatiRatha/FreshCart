import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import getAuthenticatedUser from "./middlewares/auth.js";

dotenv.config();
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connection established");

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await apolloServer.start();

    app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => {
          const user = await getAuthenticatedUser(req);
          return {
            user,
            req,
            res,
          };
        },
      }),
    );

    app.listen(PORT, () => {
      console.log(`Server connected at http://localhost:${PORT}`);
      console.log(`QraphQL running at http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.log("Server startup failed:", err.message);
  }
};

startServer();
