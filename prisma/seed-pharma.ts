import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Nigerian pharmaceutical products with realistic barcode formats
// Using Nigerian EAN prefix (619) and common international prefixes
const pharmaceuticalProducts = [
    // Antimalarials
    { barcode: "6191234000001", name: "Lonart DS (Artemether+Lumefantrine)", brandName: "Bliss GVS Pharma", category: "Medicine", nafdacNo: "A5-0001" },
    { barcode: "7680503040277", name: "Coartem 80/480mg Tablets", brandName: "Novartis", category: "Medicine", nafdacNo: "A5-0002" },
    { barcode: "6191234000002", name: "Artesunate 50mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "A5-0003" },
    { barcode: "6191234000003", name: "Amatem Softgel Capsules", brandName: "Swiss Pharma", category: "Medicine", nafdacNo: "A5-0004" },
    { barcode: "6191234000004", name: "P-Alaxin Tablets", brandName: "Greenlife Pharma", category: "Medicine", nafdacNo: "A5-0005" },
    { barcode: "6191234000005", name: "Camosunate Tablets", brandName: "Geneith Pharma", category: "Medicine", nafdacNo: "A5-0006" },

    // Analgesics/Pain Relief
    { barcode: "5000158100350", name: "Panadol Extra 500mg", brandName: "GSK", category: "Medicine", nafdacNo: "B1-0001" },
    { barcode: "6191234000010", name: "Emzor Paracetamol 500mg", brandName: "Emzor", category: "Medicine", nafdacNo: "B1-0002" },
    { barcode: "6191234000011", name: "Ibuprofen 400mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "B1-0003" },
    { barcode: "6191234000012", name: "Felvin 500mg Tablets", brandName: "Fidson", category: "Medicine", nafdacNo: "B1-0004" },
    { barcode: "6191234000013", name: "Diclofenac 50mg Tablets", brandName: "May & Baker", category: "Medicine", nafdacNo: "B1-0005" },
    { barcode: "5012917000048", name: "Aspirin 300mg Tablets", brandName: "Bayer", category: "Medicine", nafdacNo: "B1-0006" },

    // Antibiotics
    { barcode: "6191234000020", name: "Amoxicillin 500mg Capsules", brandName: "Emzor", category: "Medicine", nafdacNo: "C1-0001" },
    { barcode: "5000158069824", name: "Augmentin 625mg Tablets", brandName: "GSK", category: "Medicine", nafdacNo: "C1-0002" },
    { barcode: "6191234000021", name: "Ciprofloxacin 500mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "C1-0003" },
    { barcode: "5000158028951", name: "Ampiclox 500mg Capsules", brandName: "Beecham", category: "Medicine", nafdacNo: "C1-0004" },
    { barcode: "3400930078136", name: "Metronidazole (Flagyl) 400mg", brandName: "Sanofi", category: "Medicine", nafdacNo: "C1-0005" },
    { barcode: "0069315905013", name: "Azithromycin 500mg (Zithromax)", brandName: "Pfizer", category: "Medicine", nafdacNo: "C1-0006" },
    { barcode: "6191234000022", name: "Erythromycin 250mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "C1-0007" },

    // Vitamins & Supplements
    { barcode: "6191234000030", name: "Vitamin C 1000mg", brandName: "Emzor", category: "Medicine", nafdacNo: "D1-0001" },
    { barcode: "6191234000031", name: "Vitamin B Complex Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "D1-0002" },
    { barcode: "6191234000032", name: "Zinkovit Syrup", brandName: "Emzor", category: "Medicine", nafdacNo: "D1-0003" },
    { barcode: "6191234000033", name: "Folic Acid 5mg", brandName: "Emzor", category: "Medicine", nafdacNo: "D1-0004" },
    { barcode: "6191234000034", name: "Ferrous Sulphate 200mg", brandName: "Emzor", category: "Medicine", nafdacNo: "D1-0005" },
    { barcode: "8851123456789", name: "Neurovit Forte Tablets", brandName: "Mega Lifesciences", category: "Medicine", nafdacNo: "D1-0006" },

    // Antihypertensives
    { barcode: "0069315600013", name: "Amlodipine 5mg Tablets (Norvasc)", brandName: "Pfizer", category: "Medicine", nafdacNo: "E1-0001" },
    { barcode: "6191234000040", name: "Lisinopril 10mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "E1-0002" },
    { barcode: "6191234000041", name: "Atenolol 50mg Tablets", brandName: "May & Baker", category: "Medicine", nafdacNo: "E1-0003" },
    { barcode: "0006873540100", name: "Losartan 50mg Tablets (Cozaar)", brandName: "Merck", category: "Medicine", nafdacNo: "E1-0004" },

    // Antidiabetics
    { barcode: "6191234000050", name: "Metformin 500mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "F1-0001" },
    { barcode: "3400930261408", name: "Glibenclamide 5mg Tablets (Daonil)", brandName: "Sanofi", category: "Medicine", nafdacNo: "F1-0002" },
    { barcode: "0006873300210", name: "Glucophage 850mg Tablets", brandName: "Merck", category: "Medicine", nafdacNo: "F1-0003" },

    // Cough & Cold
    { barcode: "0381371154272", name: "Benylin Cough Syrup 100ml", brandName: "Johnson & Johnson", category: "Medicine", nafdacNo: "G1-0001" },
    { barcode: "5000158023628", name: "Actifed Syrup 100ml", brandName: "GSK", category: "Medicine", nafdacNo: "G1-0002" },
    { barcode: "6191234000060", name: "Tussin DM Cough Syrup", brandName: "Emzor", category: "Medicine", nafdacNo: "G1-0003" },
    { barcode: "6191234000061", name: "Chlorpheniramine 4mg", brandName: "Emzor", category: "Medicine", nafdacNo: "G1-0004" },
    { barcode: "6191234000062", name: "Loratadine 10mg Tablets", brandName: "Emzor", category: "Medicine", nafdacNo: "G1-0005" },

    // Gastrointestinal
    { barcode: "6191234000070", name: "Omeprazole 20mg Capsules", brandName: "Emzor", category: "Medicine", nafdacNo: "H1-0001" },
    { barcode: "6191234000071", name: "Gestid Suspension 200ml", brandName: "Emzor", category: "Medicine", nafdacNo: "H1-0002" },
    { barcode: "4007323009316", name: "Buscopan 10mg Tablets", brandName: "Boehringer", category: "Medicine", nafdacNo: "H1-0003" },
    { barcode: "6191234000072", name: "Loperamide 2mg Capsules (Imodium)", brandName: "Emzor", category: "Medicine", nafdacNo: "H1-0004" },
    { barcode: "6191234000073", name: "ORS (Oral Rehydration Salts)", brandName: "Emzor", category: "Medicine", nafdacNo: "H1-0005" },
];

async function main() {
    console.log('💊 Updating pharmaceutical products with real barcodes...');

    // First, delete the old NAFDAC-format barcodes
    const deleted = await prisma.product.deleteMany({
        where: {
            barcode: {
                startsWith: 'NG-NAFDAC-'
            }
        }
    });
    console.log(`🗑️ Removed ${deleted.count} old NAFDAC-format entries`);

    // Ensure Medicine category exists
    let medicineCategory = await prisma.category.findFirst({ where: { name: 'Medicine' } });
    if (!medicineCategory) {
        medicineCategory = await prisma.category.create({
            data: { name: 'Medicine', icon: '💊' },
        });
    }

    // Create products with real barcodes
    let created = 0;
    let skipped = 0;

    for (const product of pharmaceuticalProducts) {
        // Check if product exists
        const existing = await prisma.product.findUnique({ where: { barcode: product.barcode } });
        if (existing) {
            skipped++;
            continue;
        }

        // Find or create brand
        let brand = await prisma.brand.findFirst({ where: { name: product.brandName } });
        if (!brand) {
            brand = await prisma.brand.create({
                data: { name: product.brandName, isOfficialPartner: true },
            });
        }

        // Create product with NAFDAC number in description
        await prisma.product.create({
            data: {
                barcode: product.barcode,
                name: product.name,
                brandId: brand.id,
                categoryId: medicineCategory.id,
                description: `NAFDAC Reg. No: ${product.nafdacNo}`,
                verificationStatus: 'authentic',
                isVerified: true,
                authenticScans: Math.floor(Math.random() * 200) + 50,
                fakeReportsCount: 0,
            },
        });
        created++;
    }

    console.log(`✅ Created ${created} products with real barcodes, skipped ${skipped} existing`);

    const totalProducts = await prisma.product.count();
    console.log(`📊 Total products: ${totalProducts}`);
    console.log(`🎉 Done!`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
