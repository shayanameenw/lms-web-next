import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.category.createMany({
		data: [
			{ name: "Computer Science" },
			{ name: "Data Science" },
			{ name: "Computer Engineering" },
			{ name: "Accounting" },
			{ name: "Filming" },
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
