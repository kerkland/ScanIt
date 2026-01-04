import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "Image data is required" },
                { status: 400 }
            );
        }

        // Analyze the image using AI
        const result = await analyzeImage(image);

        return NextResponse.json({
            success: true,
            analysis: {
                isLikelyFake: result.isLikelyFake,
                confidence: result.confidence,
                riskLevel: result.overallRisk,
                issues: result.issues,
                extractedText: result.extractedText,
                detectedBrands: result.detectedBrands,
                suggestedAction: result.suggestedAction,
                source: result.source,
            },
        });
    } catch (error) {
        console.error("AI analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze image" },
            { status: 500 }
        );
    }
}
