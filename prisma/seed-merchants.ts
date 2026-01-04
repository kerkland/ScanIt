import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// More Nigerian merchants
const nigerianMerchants = [
    // Lagos
    { name: "Shoprite Ikeja City Mall", address: "Alausa, Ikeja", city: "Lagos", state: "Lagos", rating: 4.8, reviews: 245, verified: true },
    { name: "Spar Nigeria - Lekki", address: "Admiralty Way, Lekki Phase 1", city: "Lagos", state: "Lagos", rating: 4.5, reviews: 189, verified: true },
    { name: "Hubmart Superstore", address: "Allen Avenue, Ikeja", city: "Lagos", state: "Lagos", rating: 4.3, reviews: 156, verified: true },
    { name: "Justrite Supermarket Festac", address: "2nd Avenue, Festac Town", city: "Lagos", state: "Lagos", rating: 4.2, reviews: 134, verified: true },
    { name: "Ebeano Supermarket Lekki", address: "Admiralty Road, Lekki Phase 1", city: "Lagos", state: "Lagos", rating: 4.6, reviews: 201, verified: true },
    { name: "Next Cash & Carry", address: "Jabi, Abuja", city: "Abuja", state: "FCT", rating: 4.7, reviews: 312, verified: true },
    { name: "Prince Ebeano Supermarket", address: "Wuse 2", city: "Abuja", state: "FCT", rating: 4.4, reviews: 178, verified: true },
    { name: "Dunes Center Abuja", address: "Central Business District", city: "Abuja", state: "FCT", rating: 4.3, reviews: 145, verified: true },
    { name: "Game Stores Palms", address: "Lekki-Epe Expressway", city: "Lagos", state: "Lagos", rating: 4.1, reviews: 167, verified: true },
    { name: "Addide Supermarket", address: "Trans Amadi, Port Harcourt", city: "Port Harcourt", state: "Rivers", rating: 4.0, reviews: 89, verified: false },
    { name: "Market Square Supermarket", address: "Wuse 2", city: "Abuja", state: "FCT", rating: 4.2, reviews: 156, verified: false },

    // Pharmacies
    { name: "HealthPlus Pharmacy", address: "Victoria Island", city: "Lagos", state: "Lagos", rating: 4.7, reviews: 223, verified: true },
    { name: "Medplus Pharmacy", address: "Ikeja GRA", city: "Lagos", state: "Lagos", rating: 4.5, reviews: 187, verified: true },
    { name: "Alpha Pharmacy", address: "Opebi, Ikeja", city: "Lagos", state: "Lagos", rating: 4.2, reviews: 98, verified: false },
    { name: "Emzor Pharmacy", address: "Isolo Industrial Area", city: "Lagos", state: "Lagos", rating: 4.6, reviews: 156, verified: true },

    // Electronics
    { name: "Slot Nigeria", address: "Computer Village, Ikeja", city: "Lagos", state: "Lagos", rating: 4.4, reviews: 445, verified: true },
    { name: "Pointek Stores", address: "Maryland Mall", city: "Lagos", state: "Lagos", rating: 4.3, reviews: 234, verified: true },
    { name: "3C Hub", address: "The Palms, Lekki", city: "Lagos", state: "Lagos", rating: 4.5, reviews: 189, verified: true },

    // More locations
    { name: "Shoprite Owerri", address: "World Bank Road", city: "Owerri", state: "Imo", rating: 4.2, reviews: 112, verified: true },
    { name: "Roban Stores", address: "New Market Road", city: "Onitsha", state: "Anambra", rating: 4.0, reviews: 78, verified: false },
    { name: "Shoprite Kano", address: "Ado Bayero Mall", city: "Kano", state: "Kano", rating: 4.1, reviews: 145, verified: true },
    { name: "De Prince Supermarket", address: "Taiwo Road", city: "Ilorin", state: "Kwara", rating: 3.9, reviews: 67, verified: false },
    { name: "Spar Ibadan", address: "Cocoa House, Dugbe", city: "Ibadan", state: "Oyo", rating: 4.3, reviews: 134, verified: true },
    { name: "Hubmart Abeokuta", address: "Sapon", city: "Abeokuta", state: "Ogun", rating: 4.0, reviews: 89, verified: false },
    { name: "Everyday Supermarket", address: "Agu-Awka", city: "Awka", state: "Anambra", rating: 3.8, reviews: 56, verified: false },
];

async function main() {
    console.log('🏪 Seeding Nigerian merchants...');

    let created = 0;
    let skipped = 0;

    for (const merchant of nigerianMerchants) {
        // Check if merchant exists
        const existing = await prisma.merchant.findFirst({
            where: { name: merchant.name }
        });

        if (existing) {
            skipped++;
            continue;
        }

        await prisma.merchant.create({
            data: {
                name: merchant.name,
                address: merchant.address,
                city: merchant.city,
                state: merchant.state,
                avgRating: merchant.rating,
                reviewCount: merchant.reviews,
                fakeReports: Math.floor(Math.random() * 3),
                isVerified: merchant.verified,
            },
        });
        created++;
    }

    console.log(`✅ Created ${created} merchants, skipped ${skipped} existing`);

    const totalMerchants = await prisma.merchant.count();
    console.log(`📊 Total merchants: ${totalMerchants}`);
    console.log('🎉 Merchants seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding merchants:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
