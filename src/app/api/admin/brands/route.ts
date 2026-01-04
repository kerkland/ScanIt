import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, sanitizeInput } from "@/lib/auth";

// Get all brands (admin only)
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const brands = await prisma.brand.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ brands });
    } catch (error) {
        console.error("Get brands error:", error);
        return NextResponse.json({ error: "Failed to get brands" }, { status: 500 });
    }
}

// Create new brand (admin only)
export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { name, logo, website, isOfficialPartner } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
        }

        const cleanName = sanitizeInput(name);

        const brand = await prisma.brand.create({
            data: {
                name: cleanName,
                logo: logo || null,
                website: website || null,
                isOfficialPartner: isOfficialPartner || false,
            },
        });

        return NextResponse.json({ success: true, brand });
    } catch (error) {
        console.error("Create brand error:", error);
        return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
    }
}
