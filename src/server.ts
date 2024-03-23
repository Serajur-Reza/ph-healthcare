import { Server } from "http";
import app from "./app";
import config from "./config";

const port = 3000;

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Radioactive prisma running at port 3000");
  });
}

main();
