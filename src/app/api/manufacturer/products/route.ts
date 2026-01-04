import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getManufacturerId, requireManufacturer } from "@/lib/manufacturer-auth";
import { sanitizeInput } from "@/lib/auth";

// Get manufacturer's product submissions
export async function GET() {
    const manufacturerId = await getManufacturerId();

    if (!manufacturerId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const submissions = await prisma.productSubmission.findMany({
            where: { manufacturerId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ submissions });
    } catch (error) {
        console.error("Get submissions error:", error);
        return NextResponse.json(
            { error: "Failed to get submissions" },
            { status: 500 }
        );
    }
}

// Submit a new product for verification
export async function POST(request: NextRequest) {
    const authError = await requireManufacturer();
    if (authError) return authError;

    const manufacturerId = await getManufacturerId();
    if (!manufacturerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const {
            barcode,
            name,
            description,
            images,
            categoryId,
            nafdacRegNo,
        } = await request.json();

        // Validate required fields
        if (!barcode || !name) {
            return NextResponse.json(
                { error: "Barcode and product name are required" },
                { status: 400 }
            );
        }

        // Validate barcode format
        if (!/^\d{8,14}$/.test(barcode)) {
            return NextResponse.json(
                { error: "Invalid barcode format. Must be 8-14 digits." },
                { status: 400 }
            );
        }

        // Check if barcode already exists in products
        const existingProduct = await prisma.product.findUnique({
            where: { barcode },
        });

        if (existingProduct) {
            return NextResponse.json(
                { error: "A product with this barcode already exists in our database" },
                { status: 400 }
            );
        }

        // Check for pending submission with same barcode
        const existingSubmission = await prisma.productSubmission.findFirst({
            where: {
                barcode,
                status: "pending",
            },
        });

        if (existingSubmission) {
            return NextResponse.json(
                { error: "A submission with this barcode is already pending" },
                { status: 400 }
            );
        }

        // Sanitize inputs
        const cleanName = sanitizeInput(name);
        const cleanDescription = description ? sanitizeInput(description) : null;

        // Create submission
        const submission = await prisma.productSubmission.create({
            data: {
                manufacturerId,
                barcode,
                name: cleanName,
                description: cleanDescription,
                images: images ? JSON.stringify(images) : null,
                categoryId: categoryId || null,
                nafdacRegNo: nafdacRegNo || null,
                status: "pending",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Product submitted for verification",
            submission,
        });
    } catch (error) {
        console.error("Submit product error:", error);
        return NextResponse.json(
            { error: "Failed to submit product" },
            { status: 500 }
        );
    }
}
