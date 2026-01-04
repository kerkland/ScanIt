/**
 * Manufacturer Authentication
 * 
 * Simple password hashing and session management for manufacturers.
 * Uses a basic hash for simplicity - in production, use bcrypt.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

/**
 * Simple password hashing (for demo - use bcrypt in production)
 */
export function hashPassword(password: string): string {
    // Simple hash using built-in crypto
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}

/**
 * Manufacturer session cookie name
 */
const MANUFACTURER_SESSION_COOKIE = "manufacturer_session";

/**
 * Set manufacturer session
 */
export function setManufacturerSession(manufacturerId: string): NextResponse {
    const response = NextResponse.json({ success: true });
    response.cookies.set(MANUFACTURER_SESSION_COOKIE, manufacturerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
}

/**
 * Get current manufacturer ID from session
 */
export async function getManufacturerId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(MANUFACTURER_SESSION_COOKIE)?.value || null;
}

/**
 * Get current manufacturer from session
 */
export async function getCurrentManufacturer() {
    const manufacturerId = await getManufacturerId();
    if (!manufacturerId) return null;

    try {
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: manufacturerId },
            include: { brand: true },
        });
        return manufacturer;
    } catch {
        return null;
    }
}

/**
 * Require manufacturer authentication middleware
 */
export async function requireManufacturer(): Promise<NextResponse | null> {
    const manufacturer = await getCurrentManufacturer();

    if (!manufacturer) {
        return NextResponse.json(
            { error: "Unauthorized - Manufacturer login required" },
            { status: 401 }
        );
    }

    if (!manufacturer.isApproved) {
        return NextResponse.json(
            { error: "Account pending approval" },
            { status: 403 }
        );
    }

    if (!manufacturer.isActive) {
        return NextResponse.json(
            { error: "Account is disabled" },
            { status: 403 }
        );
    }

    return null;
}

/**
 * Clear manufacturer session (logout)
 */
export function clearManufacturerSession(): NextResponse {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(MANUFACTURER_SESSION_COOKIE);
    return response;
}
