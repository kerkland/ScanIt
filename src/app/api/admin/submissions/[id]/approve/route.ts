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
        // Get submission details
        const submission = await prisma.productSubmission.findUnique({
            where: { id },
            include: { manufacturer: true },
        });

        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        // Create the product
        const product = await prisma.product.create({
            data: {
                barcode: submission.barcode,
                name: submission.name,
                description: submission.description,
                images: submission.images,
                categoryId: submission.categoryId,
                isVerified: true,
                verificationStatus: "authentic",
                metadata: JSON.stringify({ nafdacRegNo: submission.nafdacRegNo }),
            },
        });

        // Update submission status
        await prisma.productSubmission.update({
            where: { id },
            data: {
                status: "approved",
                productId: product.id,
            },
        });

        return NextResponse.redirect(new URL("/admin/submissions", request.url));
    } catch (error) {
        console.error("Approve submission error:", error);
        return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
    }
}
