import { Server } from "http";
import app from "./app";

const port = 3000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Radioactive prisma running at port 3000");
  });
}

main();
