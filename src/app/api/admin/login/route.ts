import { NextRequest, NextResponse } from "next/server";

// Use environment variable for admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true });

            response.cookies.set("admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return response;
        }

        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}
