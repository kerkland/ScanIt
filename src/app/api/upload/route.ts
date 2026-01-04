import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { rateLimit, getRateLimitId } from "@/lib/auth";

export async function POST(request: NextRequest) {
    // Rate limit: max 10 uploads per hour per user
    const rateLimitId = getRateLimitId(request);
    const { allowed, resetIn } = rateLimit(`upload_${rateLimitId}`, {
        maxRequests: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!allowed) {
        return NextResponse.json(
            {
                error: "Too many uploads. Please try again later.",
                retryAfter: Math.ceil(resetIn / 1000)
            },
            { status: 429 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        // Create unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `report_${timestamp}_${randomStr}.${extension}`;

        // Ensure uploads directory exists
        const uploadsDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            filename,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
