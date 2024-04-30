import { PrismaClient } from "@prisma/client";

export type {
	Chapter,
	Category,
	Course,
	Attachment,
	MuxData,
	Purchase,
	StripeCustomer,
	UserProgress,
} from "@prisma/client";

declare global {
	// noinspection ES6ConvertVarToLetConst
	var prismaClient: PrismaClient | undefined;
}

const db = globalThis.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaClient = db;
}

export default db;
