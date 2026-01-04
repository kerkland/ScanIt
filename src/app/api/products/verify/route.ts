import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/lib/verification";

export async function POST(request: NextRequest) {
    try {
        const { barcode } = await request.json();

        if (!barcode) {
            return NextResponse.json(
                { error: "Barcode is required" },
                { status: 400 }
            );
        }

        // Use the verification service (tries NAFDAC first, then local DB)
        const result = await verify(barcode);

        return NextResponse.json({
            found: result.found,
            barcode,
            product: result.found ? {
                name: result.product?.name,
                brand: result.product?.brand,
                category: result.product?.category,
                manufacturer: result.product?.manufacturer,
                registrationNumber: result.product?.registrationNumber,
                isNAFDACRegistered: result.product?.isNAFDACRegistered,
                images: result.product?.images,
            } : null,
            verificationStatus: result.status,
            confidence: result.confidence,
            source: result.source,
            warnings: result.warnings,
        });
    } catch (error) {
        console.error("Verify product error:", error);
        return NextResponse.json(
            { error: "Failed to verify product" },
            { status: 500 }
        );
    }
}
