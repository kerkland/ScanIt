import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin Authentication Middleware
 * 
 * Use this to protect admin API routes:
 * 
 * import { requireAdmin } from "@/lib/auth";
 * 
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAdmin();
 *   if (authError) return authError;
 *   // ... rest of your code
 * }
 */

export async function requireAdmin(): Promise<NextResponse | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (session !== "authenticated") {
        return NextResponse.json(
            { error: "Unauthorized - Admin access required" },
            { status: 401 }
        );
    }

    return null; // Authenticated
}

/**
 * Simple in-memory rate limiter
 * 
 * For production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number; // milliseconds
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (value.resetTime < now) {
                rateLimitMap.delete(key);
            }
        }
    }

    if (!record || record.resetTime < now) {
        // New window
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs,
        };
    }

    if (record.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: record.resetTime - now,
        };
    }

    record.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - record.count,
        resetIn: record.resetTime - now,
    };
}

/**
 * Get rate limit identifier from request
 * Uses IP address or session ID
 */
export function getRateLimitId(request: NextRequest): string {
    // Try to get IP from headers (for proxied requests)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "unknown";

    // Also check session for more accurate limiting
    const sessionId = request.cookies.get("scanit_session")?.value;

    return sessionId || `ip_${ip}`;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;")
        .trim();
}

/**
 * Validate barcode format
 */
export function isValidBarcode(barcode: string): boolean {
    // Allow 8-14 digit barcodes (EAN-8, UPC, EAN-13, etc.)
    return /^\d{8,14}$/.test(barcode);
}
