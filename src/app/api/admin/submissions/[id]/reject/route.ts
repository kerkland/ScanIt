import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;

    try {
        await prisma.productSubmission.update({
            where: { id },
            data: {
                status: "rejected",
                rejectionReason: "Did not meet verification requirements",
            },
        });

        return NextResponse.redirect(new URL("/admin/submissions", request.url));
    } catch (error) {
        console.error("Reject submission error:", error);
        return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
    }
}
