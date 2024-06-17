import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema({
  shelves: {
    type: Number,
    required: true,
  },
  shelfNames: {
    type: [String],
    required: true,
  },
});

const WarehouseSchema = new mongoose.Schema({
  warehouseName: {
    type: String,
    required: true,
  },
  zones: {
    type: [ZoneSchema],
    required: true,
  },
});

const Warehouse = mongoose.model("Warehouse", WarehouseSchema);

const app = express();
const port = 9000;

mongoose.connect(String(process.env.MONGO_URI));
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.on("open", () => console.log("Connected to MongoDB"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/create", async (req, res) => {
  const warehouse = new Warehouse({
    warehouseName: req.body.name,
    zones: req.body.zones,
  });

  try {
    const newWarehouse = await warehouse.save();
    res.status(201).json(newWarehouse);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
