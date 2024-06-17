"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const ZoneSchema = new mongoose_1.default.Schema({
    shelves: {
        type: Number,
        required: true,
    },
    shelfNames: {
        type: [String],
        required: true,
    },
});
const WarehouseSchema = new mongoose_1.default.Schema({
    warehouseName: {
        type: String,
        required: true,
    },
    zones: {
        type: [ZoneSchema],
        required: true,
    },
});
const Warehouse = mongoose_1.default.model("Warehouse", WarehouseSchema);
const app = (0, express_1.default)();
const port = 9000;
mongoose_1.default.connect(String(process.env.MONGO_URI));
const db = mongoose_1.default.connection;
db.on("error", (err) => console.error(err));
db.on("open", () => console.log("Connected to MongoDB"));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const warehouse = new Warehouse({
        warehouseName: req.body.name,
        zones: req.body.zones,
    });
    try {
        const newWarehouse = yield warehouse.save();
        res.status(201).json(newWarehouse);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
