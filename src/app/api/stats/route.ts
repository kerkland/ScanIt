import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get real-time stats for the homepage
export async function GET() {
    try {
        // Get counts from database
        const [products, reports, merchants, scans] = await Promise.all([
            prisma.product.count(),
            prisma.report.count(),
            prisma.merchant.count(),
            prisma.scan.count(),
        ]);

        return NextResponse.json({
            products,
            reports,
            merchants,
            scans,
        });
    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json(
            { products: 0, reports: 0, merchants: 0, scans: 0 },
            { status: 500 }
        );
    }
}
