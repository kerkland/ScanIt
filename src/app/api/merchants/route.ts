import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all merchants
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city");
        const verifiedOnly = searchParams.get("verified") === "true";

        const merchants = await prisma.merchant.findMany({
            where: {
                ...(city && { city }),
                ...(verifiedOnly && { isVerified: true }),
            },
            orderBy: [
                { avgRating: "desc" },
                { reviewCount: "desc" },
            ],
            take: 50,
        });

        return NextResponse.json({ merchants });
    } catch (error) {
        console.error("Get merchants error:", error);
        return NextResponse.json(
            { error: "Failed to get merchants" },
            { status: 500 }
        );
    }
}

// Add a new merchant
export async function POST(request: NextRequest) {
    try {
        const { name, address, city, state, latitude, longitude } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Merchant name is required" },
                { status: 400 }
            );
        }

        const merchant = await prisma.merchant.create({
            data: {
                name,
                address: address || null,
                city: city || null,
                state: state || null,
                latitude: latitude || null,
                longitude: longitude || null,
                avgRating: 0,
                reviewCount: 0,
                fakeReports: 0,
                isVerified: false,
            },
        });

        return NextResponse.json({ success: true, merchant });
    } catch (error) {
        console.error("Create merchant error:", error);
        return NextResponse.json(
            { error: "Failed to add merchant" },
            { status: 500 }
        );
    }
}
