"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = 9000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use(express_1.default.json());
app.post("/create", (req, res) => {
    const data = {
        name: req.body.name,
        zones: req.body.zones,
    };
    console.log(data.zones);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
