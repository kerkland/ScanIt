import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, sanitizeInput } from "@/lib/auth";

// Get all products (admin only)
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const products = await prisma.product.findMany({
            include: {
                brand: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ products });
    } catch (error) {
        console.error("Get products error:", error);
        return NextResponse.json({ error: "Failed to get products" }, { status: 500 });
    }
}

// Create new product (admin only)
export async function POST(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { barcode, name, description, brandId, categoryId, verificationStatus, isVerified } = await request.json();

        if (!barcode || !name) {
            return NextResponse.json({ error: "Barcode and name are required" }, { status: 400 });
        }

        // Sanitize inputs
        const cleanName = sanitizeInput(name);
        const cleanDescription = description ? sanitizeInput(description) : null;

        // Check if barcode already exists
        const existing = await prisma.product.findUnique({ where: { barcode } });
        if (existing) {
            return NextResponse.json({ error: "Product with this barcode already exists" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                barcode,
                name: cleanName,
                description: cleanDescription,
                brandId: brandId || null,
                categoryId: categoryId || null,
                verificationStatus: verificationStatus || "unknown",
                isVerified: isVerified || false,
                authenticScans: 0,
                fakeReportsCount: 0,
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
