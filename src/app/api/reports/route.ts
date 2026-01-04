import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitId, sanitizeInput } from "@/lib/auth";

function getSessionId(request: NextRequest): string {
    let sessionId = request.cookies.get("scanit_session")?.value;
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    return sessionId;
}

// Submit a fake product report
export async function POST(request: NextRequest) {
    // Rate limit: max 5 reports per hour per user
    const rateLimitId = getRateLimitId(request);
    const { allowed, remaining, resetIn } = rateLimit(`report_${rateLimitId}`, {
        maxRequests: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!allowed) {
        return NextResponse.json(
            {
                error: "Too many reports. Please try again later.",
                retryAfter: Math.ceil(resetIn / 1000)
            },
            { status: 429 }
        );
    }

    try {
        const {
            barcode,
            productName,
            description,
            purchaseLocation,
            city,
            merchantId,
            latitude,
            longitude,
            images,
        } = await request.json();

        const sessionId = getSessionId(request);

        // Sanitize text inputs
        const cleanProductName = productName ? sanitizeInput(productName) : null;
        const cleanDescription = description ? sanitizeInput(description) : "No description provided";
        const cleanLocation = purchaseLocation ? sanitizeInput(purchaseLocation) : null;
        const cleanCity = city ? sanitizeInput(city) : null;

        // Check if product exists
        let product = null;
        if (barcode) {
            product = await prisma.product.findUnique({
                where: { barcode },
            });
        }

        // Create the report with images
        const report = await prisma.report.create({
            data: {
                sessionId,
                barcode: barcode || null,
                productName: cleanProductName,
                description: cleanDescription,
                purchaseLocation: cleanLocation,
                merchantId: merchantId || null,
                productId: product?.id || null,
                city: cleanCity,
                latitude: latitude || null,
                longitude: longitude || null,
                status: "pending",
                evidenceImages: images && images.length > 0 ? JSON.stringify(images) : null,
            },
        });

        // If product exists, increment fake reports count and update status
        if (product) {
            const newFakeCount = product.fakeReportsCount + 1;
            let newStatus = product.verificationStatus;

            // Auto-update status based on report count
            if (newFakeCount >= 5) {
                newStatus = "fake";
            } else if (newFakeCount >= 2) {
                newStatus = "suspicious";
            }

            await prisma.product.update({
                where: { id: product.id },
                data: {
                    fakeReportsCount: newFakeCount,
                    verificationStatus: newStatus,
                },
            });
        } else if (barcode && productName) {
            // Create new product entry marked as suspicious
            await prisma.product.create({
                data: {
                    barcode,
                    name: productName,
                    verificationStatus: "suspicious",
                    fakeReportsCount: 1,
                    isVerified: false,
                },
            });
        }

        const response = NextResponse.json({
            success: true,
            report,
            message: "Report submitted successfully"
        });

        response.cookies.set("scanit_session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
        });

        return response;
    } catch (error) {
        console.error("Create report error:", error);
        return NextResponse.json(
            { error: "Failed to submit report" },
            { status: 500 }
        );
    }
}

// Get reports
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const reports = await prisma.report.findMany({
            where: status ? { status } : undefined,
            include: {
                product: true,
                merchant: true,
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({ reports });
    } catch (error) {
        console.error("Get reports error:", error);
        return NextResponse.json(
            { error: "Failed to get reports" },
            { status: 500 }
        );
    }
}
