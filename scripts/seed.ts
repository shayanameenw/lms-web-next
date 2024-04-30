import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.category.deleteMany({});

	await prisma.category.createMany({
		data: [
			{ name: "Accounting" },
			{ name: "Computer Science" },
			{ name: "Data Science" },
			{ name: "Engineering" },
			{ name: "Filming" },
			{ name: "Music" },
			{ name: "Photography" },
		],
	});
}

main()
	.then(async () => {
		console.log("Successfully seeded database!");
	})
	.catch((error) => {
		console.log("Error seeding database!", error);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
