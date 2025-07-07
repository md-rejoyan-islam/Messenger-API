"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    await mongoose_1.default.connect(process.env.MONGO_URI || "");
});
(0, vitest_1.afterAll)(async () => {
    await mongoose_1.default.connection.close();
});
