import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;

    try {
        await prisma.manufacturer.update({
            where: { id },
            data: { isApproved: true },
        });

        // For form submissions, redirect back to the page
        return NextResponse.redirect(new URL("/admin/manufacturers", request.url));
    } catch (error) {
        console.error("Approve manufacturer error:", error);
        return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
    }
}
