import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setManufacturerSession } from "@/lib/manufacturer-auth";
import { rateLimit, getRateLimitId } from "@/lib/auth";

export async function POST(request: NextRequest) {
    // Rate limit: max 10 login attempts per hour per IP
    const rateLimitId = getRateLimitId(request);
    const { allowed } = rateLimit(`mfr_login_${rateLimitId}`, {
        maxRequests: 10,
        windowMs: 60 * 60 * 1000,
    });

    if (!allowed) {
        return NextResponse.json(
            { error: "Too many login attempts. Please try again later." },
            { status: 429 }
        );
    }

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find manufacturer
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!manufacturer) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        if (!verifyPassword(password, manufacturer.passwordHash)) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Check if account is active
        if (!manufacturer.isActive) {
            return NextResponse.json(
                { error: "Your account has been disabled. Please contact support." },
                { status: 403 }
            );
        }

        // Set session cookie
        const response = setManufacturerSession(manufacturer.id);

        // Return success with manufacturer info
        return NextResponse.json({
            success: true,
            manufacturer: {
                id: manufacturer.id,
                email: manufacturer.email,
                companyName: manufacturer.companyName,
                isApproved: manufacturer.isApproved,
            },
        });
    } catch (error) {
        console.error("Manufacturer login error:", error);
        return NextResponse.json(
            { error: "Login failed. Please try again." },
            { status: 500 }
        );
    }
}
