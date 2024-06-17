import express from "express";
import cors from "cors";
import "dotenv/config";

interface Zone {
  shelves: number;
  shelfNames: string[];
}

interface Factory {
  name: string;
  zones: Zone[];
}

const app = express();
const port = 9000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(express.json());

app.post("/create", (req, res) => {
  const data = {
    name: req.body.name,
    zones: req.body.zones,
  };
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
