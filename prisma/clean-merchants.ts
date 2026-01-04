import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Major well-known Nigerian retailers to keep
const majorMerchants = [
    "Shoprite",
    "Spar",
    "Konga",
    "Jumia",
    "Game",
    "Justrite",
    "Hubmart",
];

async function main() {
    // Delete all merchants NOT in the major list
    const deleted = await prisma.merchant.deleteMany({
        where: {
            name: {
                notIn: majorMerchants,
            },
        },
    });
    console.log(`✓ Deleted ${deleted.count} smaller merchants`);

    // Mark remaining as unverified
    const updated = await prisma.merchant.updateMany({
        data: {
            isVerified: false,
        },
    });
    console.log(`✓ Marked ${updated.count} major merchants as unverified`);

    // Show what's left
    const remaining = await prisma.merchant.findMany({
        select: { name: true },
    });
    console.log("\n📍 Remaining merchants:");
    remaining.forEach((m) => console.log(`   - ${m.name}`));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
