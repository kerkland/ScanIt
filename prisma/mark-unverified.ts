import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.product.updateMany({
        data: {
            isVerified: false,
            verificationStatus: "unverified",
        },
    });
    console.log(`✓ Marked ${result.count} products as unverified`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
