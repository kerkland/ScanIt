import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getSessionId(request: NextRequest): string {
    let sessionId = request.cookies.get("scanit_session")?.value;
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    return sessionId;
}

// Log a scan
export async function POST(request: NextRequest) {
    try {
        const { barcode, scanType, result, productId, latitude, longitude, city } = await request.json();
        const sessionId = getSessionId(request);

        const scan = await prisma.scan.create({
            data: {
                sessionId,
                barcode,
                scanType: scanType || "barcode",
                result: result || "unknown",
                productId: productId || null,
                latitude: latitude || null,
                longitude: longitude || null,
                city: city || null,
            },
        });

        const response = NextResponse.json({ success: true, scan });

        response.cookies.set("scanit_session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
        });

        return response;
    } catch (error) {
        console.error("Create scan error:", error);
        return NextResponse.json(
            { error: "Failed to log scan" },
            { status: 500 }
        );
    }
}

// Get scan history for current session
export async function GET(request: NextRequest) {
    try {
        const sessionId = getSessionId(request);

        const scans = await prisma.scan.findMany({
            where: { sessionId },
            include: {
                product: {
                    include: {
                        brand: true,
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({ scans });
    } catch (error) {
        console.error("Get scans error:", error);
        return NextResponse.json(
            { error: "Failed to get scan history" },
            { status: 500 }
        );
    }
}
