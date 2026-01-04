import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Nigerian products database - common products you'd find in markets
const nigerianProducts = [
    // Beverages
    { barcode: "5449000000996", name: "Coca-Cola 50cl", brandName: "Coca-Cola", category: "Beverages" },
    { barcode: "5449000131805", name: "Fanta Orange 50cl", brandName: "Fanta", category: "Beverages" },
    { barcode: "5449000000989", name: "Sprite 50cl", brandName: "Sprite", category: "Beverages" },
    { barcode: "8901030626852", name: "Pepsi 50cl", brandName: "Pepsi", category: "Beverages" },
    { barcode: "5060166691509", name: "Maltina Classic 50cl", brandName: "Maltina", category: "Beverages" },
    { barcode: "5060166691516", name: "Amstel Malta 50cl", brandName: "Amstel", category: "Beverages" },
    { barcode: "7890000001234", name: "Five Alive Citrus Burst 1L", brandName: "Five Alive", category: "Beverages" },
    { barcode: "7890000001241", name: "Hollandia Yoghurt 500ml", brandName: "Hollandia", category: "Beverages" },
    { barcode: "7890000001258", name: "Chi Exotic 1L", brandName: "Chi", category: "Beverages" },
    { barcode: "7890000001265", name: "Lucozade Boost 50cl", brandName: "Lucozade", category: "Beverages" },
    { barcode: "7890000001272", name: "Red Bull Energy Drink 250ml", brandName: "Red Bull", category: "Beverages" },
    { barcode: "7890000001289", name: "Monster Energy 500ml", brandName: "Monster", category: "Beverages" },
    { barcode: "7890000001296", name: "Eva Water 75cl", brandName: "Eva", category: "Beverages" },
    { barcode: "7890000001302", name: "Aquafina Water 75cl", brandName: "Aquafina", category: "Beverages" },
    { barcode: "7890000001319", name: "Nestle Pure Life 1.5L", brandName: "Nestle", category: "Beverages" },

    // Food
    { barcode: "8901030626869", name: "Indomie Chicken Flavour 70g", brandName: "Indomie", category: "Food" },
    { barcode: "8901030626876", name: "Indomie Onion Chicken 70g", brandName: "Indomie", category: "Food" },
    { barcode: "8901030626883", name: "Indomie Super Pack", brandName: "Indomie", category: "Food" },
    { barcode: "7890000002000", name: "Golden Penny Semovita 1kg", brandName: "Golden Penny", category: "Food" },
    { barcode: "7890000002017", name: "Golden Penny Spaghetti 500g", brandName: "Golden Penny", category: "Food" },
    { barcode: "7890000002024", name: "Dangote Sugar 1kg", brandName: "Dangote", category: "Food" },
    { barcode: "7890000002031", name: "Dangote Salt 1kg", brandName: "Dangote", category: "Food" },
    { barcode: "7890000002048", name: "Kings Vegetable Oil 3L", brandName: "Kings", category: "Food" },
    { barcode: "7890000002055", name: "Power Oil 3L", brandName: "Power Oil", category: "Food" },
    { barcode: "7890000002062", name: "Maggi Chicken Cubes 100 pack", brandName: "Maggi", category: "Food" },
    { barcode: "7890000002079", name: "Knorr Chicken Cubes 100 pack", brandName: "Knorr", category: "Food" },
    { barcode: "7890000002086", name: "Milo 500g Tin", brandName: "Milo", category: "Food" },
    { barcode: "7890000002093", name: "Bournvita 450g", brandName: "Bournvita", category: "Food" },
    { barcode: "7890000002109", name: "Peak Milk 400g", brandName: "Peak", category: "Food" },
    { barcode: "7890000002116", name: "Three Crowns Milk 400g", brandName: "Three Crowns", category: "Food" },

    // Cosmetics
    { barcode: "6001106119805", name: "Nivea Body Lotion 400ml", brandName: "Nivea", category: "Cosmetics" },
    { barcode: "6001106119812", name: "Nivea Men Face Wash 100ml", brandName: "Nivea", category: "Cosmetics" },
    { barcode: "7890000003000", name: "Vaseline Petroleum Jelly 450ml", brandName: "Vaseline", category: "Cosmetics" },
    { barcode: "7890000003017", name: "Dettol Original Soap 110g", brandName: "Dettol", category: "Cosmetics" },
    { barcode: "7890000003024", name: "Lux Beauty Soap 80g", brandName: "Lux", category: "Cosmetics" },
    { barcode: "7890000003031", name: "Sunsilk Shampoo 350ml", brandName: "Sunsilk", category: "Cosmetics" },
    { barcode: "7890000003048", name: "Dove Body Wash 500ml", brandName: "Dove", category: "Cosmetics" },
    { barcode: "7890000003055", name: "Close Up Toothpaste 140g", brandName: "Close Up", category: "Cosmetics" },
    { barcode: "7890000003062", name: "Oral-B Toothbrush", brandName: "Oral-B", category: "Cosmetics" },
    { barcode: "7890000003079", name: "Colgate Total 150g", brandName: "Colgate", category: "Cosmetics" },
    { barcode: "7890000003086", name: "Fair & Lovely Cream 50g", brandName: "Fair & Lovely", category: "Cosmetics" },
    { barcode: "7890000003093", name: "Caro White Cream 500ml", brandName: "Caro White", category: "Cosmetics" },
    { barcode: "7890000003109", name: "TCB Naturals Hair Food 250ml", brandName: "TCB", category: "Cosmetics" },
    { barcode: "7890000003116", name: "Dark and Lovely Relaxer Kit", brandName: "Dark and Lovely", category: "Cosmetics" },

    // Alcohol
    { barcode: "5011321008533", name: "Johnnie Walker Black Label 750ml", brandName: "Johnnie Walker", category: "Alcohol" },
    { barcode: "5011321008540", name: "Johnnie Walker Red Label 750ml", brandName: "Johnnie Walker", category: "Alcohol" },
    { barcode: "7890000004000", name: "Hennessy VS 750ml", brandName: "Hennessy", category: "Alcohol" },
    { barcode: "7890000004017", name: "Star Lager Beer 60cl", brandName: "Star", category: "Alcohol" },
    { barcode: "7890000004024", name: "Gulder Lager Beer 60cl", brandName: "Gulder", category: "Alcohol" },
    { barcode: "7890000004031", name: "Trophy Lager Beer 60cl", brandName: "Trophy", category: "Alcohol" },
    { barcode: "7890000004048", name: "Heineken Lager 50cl", brandName: "Heineken", category: "Alcohol" },
    { barcode: "7890000004055", name: "Guinness Foreign Extra Stout 60cl", brandName: "Guinness", category: "Alcohol" },
    { barcode: "7890000004062", name: "Smirnoff Ice 27.5cl", brandName: "Smirnoff", category: "Alcohol" },
    { barcode: "7890000004079", name: "Gordon's Gin 750ml", brandName: "Gordon's", category: "Alcohol" },

    // Medicine
    { barcode: "7890000005000", name: "Panadol Extra 500mg", brandName: "Panadol", category: "Medicine" },
    { barcode: "7890000005017", name: "Emzor Paracetamol 500mg", brandName: "Emzor", category: "Medicine" },
    { barcode: "7890000005024", name: "Lonart DS Antimalarial", brandName: "Bliss GVS", category: "Medicine" },
    { barcode: "7890000005031", name: "Coartem 80/480mg", brandName: "Novartis", category: "Medicine" },
    { barcode: "7890000005048", name: "Vitamin C 1000mg", brandName: "Emzor", category: "Medicine" },
    { barcode: "7890000005055", name: "Ampiclox 500mg", brandName: "Beecham", category: "Medicine" },
    { barcode: "7890000005062", name: "Flagyl 400mg", brandName: "Sanofi", category: "Medicine" },
    { barcode: "7890000005079", name: "Ibuprofen 400mg", brandName: "GSK", category: "Medicine" },

    // Electronics Accessories
    { barcode: "7890000006000", name: "Samsung Charger 25W", brandName: "Samsung", category: "Electronics" },
    { barcode: "7890000006017", name: "iPhone Lightning Cable 1m", brandName: "Apple", category: "Electronics" },
    { barcode: "7890000006024", name: "Oraimo Power Bank 10000mAh", brandName: "Oraimo", category: "Electronics" },
    { barcode: "7890000006031", name: "Oraimo Earbuds FreePods", brandName: "Oraimo", category: "Electronics" },
    { barcode: "7890000006048", name: "JBL Bluetooth Speaker Go 3", brandName: "JBL", category: "Electronics" },
];

async function main() {
    console.log('🌱 Seeding Nigerian products database...');

    // Create all unique brands
    const brandNames = [...new Set(nigerianProducts.map(p => p.brandName))];
    console.log(`Creating ${brandNames.length} brands...`);

    for (const brandName of brandNames) {
        const existing = await prisma.brand.findFirst({ where: { name: brandName } });
        if (!existing) {
            await prisma.brand.create({
                data: { name: brandName, isOfficialPartner: Math.random() > 0.7 },
            });
        }
    }

    // Get all brands for mapping
    const brands = await prisma.brand.findMany();
    const brandMap = new Map(brands.map(b => [b.name, b.id]));

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.name, c.id]));

    // Create all products
    console.log(`Creating ${nigerianProducts.length} products...`);
    let created = 0;
    let skipped = 0;

    for (const product of nigerianProducts) {
        const existing = await prisma.product.findUnique({ where: { barcode: product.barcode } });
        if (existing) {
            skipped++;
            continue;
        }

        await prisma.product.create({
            data: {
                barcode: product.barcode,
                name: product.name,
                brandId: brandMap.get(product.brandName) || null,
                categoryId: categoryMap.get(product.category) || null,
                verificationStatus: Math.random() > 0.1 ? "authentic" : "unknown",
                isVerified: Math.random() > 0.3,
                authenticScans: Math.floor(Math.random() * 500) + 10,
                fakeReportsCount: Math.floor(Math.random() * 5),
            },
        });
        created++;
    }

    console.log(`✅ Created ${created} products, skipped ${skipped} existing`);

    const totalProducts = await prisma.product.count();
    const totalBrands = await prisma.brand.count();

    console.log(`\n📊 Database Stats:`);
    console.log(`   - Total Products: ${totalProducts}`);
    console.log(`   - Total Brands: ${totalBrands}`);
    console.log(`\n🎉 Database seeded successfully!`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
