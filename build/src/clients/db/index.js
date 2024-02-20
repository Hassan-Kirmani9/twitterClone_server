"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma_client = void 0;
const client_1 = require("@prisma/client");
exports.prisma_client = new client_1.PrismaClient({ log: ["query"] });
