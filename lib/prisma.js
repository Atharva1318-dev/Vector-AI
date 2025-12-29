import { PrismaClient } from "@prisma/client";

// We will be using this PrismaClient() 
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is reused across hot reloads during development. Without this, each time your application reloads, a new instance of Prisma client would be created, which can lead to connection issues