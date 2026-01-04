// Seed sample fake reports for heat map visualization
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleReports = [
    // Lagos - highest activity
    { city: "Lagos", count: 15 },
    { city: "Lagos", count: 12 },
    { city: "Lagos", count: 8 },
    // Abuja
    { city: "Abuja", count: 10 },
    { city: "Abuja", count: 7 },
    // Kano
    { city: "Kano", count: 8 },
    { city: "Kano", count: 5 },
    // Port Harcourt
    { city: "Port Harcourt", count: 6 },
    { city: "Port Harcourt", count: 4 },
    // Ibadan
    { city: "Ibadan", count: 5 },
    { city: "Ibadan", count: 3 },
    // Other cities
    { city: "Benin City", count: 4 },
    { city: "Enugu", count: 3 },
    { city: "Kaduna", count: 4 },
    { city: "Onitsha", count: 5 },
    { city: "Aba", count: 3 },
    { city: "Warri", count: 2 },
    { city: "Jos", count: 2 },
    { city: "Ilorin", count: 2 },
    { city: "Owerri", count: 3 },
    { city: "Calabar", count: 1 },
];

const productNames = [
    "Fake Paracetamol Tablets",
    "Counterfeit Peak Milk",
    "Fake Coca-Cola",
    "Adulterated Palm Oil",
    "Counterfeit Nivea Cream",
    "Fake Indomie Noodles",
    "Counterfeit Star Lager",
    "Fake Maltina",
    "Adulterated Groundnut Oil",
    "Counterfeit Lipton Tea",
];

const locations = [
    "Balogun Market",
    "Computer Village",
    "Onitsha Main Market",
    "Aba Ariaria Market",
    "Alaba International Market",
    "Wuse Market",
    "Sabon Gari Market",
    "Mile 12 Market",
    "Trade Fair Complex",
    "Local Pharmacy",
    "Roadside Vendor",
    "Open Market",
];

async function main() {
    console.log("🗺️ Seeding sample reports for heat map...\n");

    let totalCreated = 0;

    for (const report of sampleReports) {
        for (let i = 0; i < report.count; i++) {
            const productName = productNames[Math.floor(Math.random() * productNames.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const isConfirmed = Math.random() > 0.6;

            await prisma.report.create({
                data: {
                    sessionId: `seed_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
                    city: report.city,
                    productName: productName,
                    description: `Suspicious ${productName.toLowerCase()} found at ${location}. Package looked different from authentic product.`,
                    purchaseLocation: location,
                    status: isConfirmed ? "confirmed" : "pending",
                },
            });

            totalCreated++;
        }
    }

    console.log(`✅ Created ${totalCreated} sample reports across ${sampleReports.length} cities\n`);

    // Show summary
    const cityCounts = await prisma.report.groupBy({
        by: ["city"],
        _count: { city: true },
        orderBy: { _count: { city: "desc" } },
    });

    console.log("📊 Reports by city:");
    for (const item of cityCounts.slice(0, 10)) {
        console.log(`   ${item.city}: ${item._count.city} reports`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
