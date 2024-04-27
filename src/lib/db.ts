import {PrismaClient} from "@prisma/client"

export type {Category, Course, Attachment} from "@prisma/client"

declare global {
  // noinspection ES6ConvertVarToLetConst
  var prismaClient: PrismaClient | undefined;
}

const db = globalThis.prismaClient || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = db
}

export default db
