import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setManufacturerSession } from "@/lib/manufacturer-auth";
import { sanitizeInput, rateLimit, getRateLimitId } from "@/lib/auth";

export async function POST(request: NextRequest) {
    // Rate limit: max 5 registrations per hour per IP
    const rateLimitId = getRateLimitId(request);
    const { allowed } = rateLimit(`mfr_register_${rateLimitId}`, {
        maxRequests: 5,
        windowMs: 60 * 60 * 1000,
    });

    if (!allowed) {
        return NextResponse.json(
            { error: "Too many registration attempts. Please try again later." },
            { status: 429 }
        );
    }

    try {
        const {
            email,
            password,
            companyName,
            phone,
            address,
            city,
            state,
            nafdacLicense,
            cacNumber,
            website,
        } = await request.json();

        // Validate required fields
        if (!email || !password || !companyName) {
            return NextResponse.json(
                { error: "Email, password, and company name are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await prisma.manufacturer.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            );
        }

        // Sanitize inputs
        const cleanCompanyName = sanitizeInput(companyName);
        const cleanAddress = address ? sanitizeInput(address) : null;
        const cleanCity = city ? sanitizeInput(city) : null;
        const cleanState = state ? sanitizeInput(state) : null;

        // Create manufacturer
        const manufacturer = await prisma.manufacturer.create({
            data: {
                email: email.toLowerCase(),
                passwordHash: hashPassword(password),
                companyName: cleanCompanyName,
                phone: phone || null,
                address: cleanAddress,
                city: cleanCity,
                state: cleanState,
                nafdacLicense: nafdacLicense || null,
                cacNumber: cacNumber || null,
                website: website || null,
                isApproved: false, // Requires admin approval
                isActive: true,
            },
        });

        // Set session cookie
        const response = setManufacturerSession(manufacturer.id);

        return NextResponse.json({
            success: true,
            message: "Registration successful! Your account is pending admin approval.",
            manufacturer: {
                id: manufacturer.id,
                email: manufacturer.email,
                companyName: manufacturer.companyName,
                isApproved: manufacturer.isApproved,
            },
        });
    } catch (error) {
        console.error("Manufacturer registration error:", error);
        return NextResponse.json(
            { error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}
