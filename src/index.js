import { app } from "./app.js";
import dotenv from "dotenv";
import DataBaseConnector from "./database/connection.js";

dotenv.config();

const port = 8000;

DataBaseConnector().then(() => {
  try {
    app.listen(port, () => {
      console.log(`app is running on Port : ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
});
