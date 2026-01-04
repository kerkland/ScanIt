import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, sanitizeInput } from "@/lib/auth";

// Get all categories (admin only)
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Get categories error:", error);
        return NextResponse.json({ error: "Failed to get categories" }, { status: 500 });
    }
}

// Create new category (admin only)
export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { name, icon } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const cleanName = sanitizeInput(name);

        const category = await prisma.category.create({
            data: {
                name: cleanName,
                icon: icon || null,
            },
        });

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error("Create category error:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
