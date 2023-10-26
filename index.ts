import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import {
  getIoInstance,
  handleSocket,
  initializeIoServer,
} from "./src/io/socket";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json"; // Change this line

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4109; // Set your desired port here

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", router);

try {
  const server = https.createServer(
    {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/app.agenciaboz.com.br/privkey.pem",
        "utf8"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/app.agenciaboz.com.br/cert.pem",
        "utf8"
      ),
      ca: fs.readFileSync(
        "/etc/letsencrypt/live/app.agenciaboz.com.br/chain.pem",
        "utf8"
      ),
    },
    app
  );

  initializeIoServer(server);
  const io = getIoInstance();

  io.on("connection", (socket) => {
    handleSocket(socket);
  });

  server.listen(port, () => {
    console.log(`[server]: Server is running at https://${port}`);
  });
} catch {
  const server = http.createServer(app);

  initializeIoServer(server);
  const io = getIoInstance();

  io.on("connection", (socket) => {
    handleSocket(socket);
  });

  server.listen(port, () => {
    console.log(`[server]: Server is running at http://${port}`);
  });
}

const swaggerApp = express(); // Create a new Express app for Swagger
swaggerApp.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const swaggerPort = 4108; // Set the port for Swagger documentation
swaggerApp.listen(swaggerPort, () => {
  console.log(
    `[swagger]: Swagger is running at http://localhost:${swaggerPort}/swagger`
  );
});
