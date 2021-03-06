import "@babel/polyfill";
import "./db";
import dotenv from "dotenv";
import app from "./app";
import "./models/Video";
import "./models/Comment";
import "./models/User";

dotenv.config();

const PORT = process.env.PORT || 3000;

const handleListening = () => {
  console.log(`✅ Listening on: localhost:${PORT}`);
};

app.listen(PORT, handleListening);
