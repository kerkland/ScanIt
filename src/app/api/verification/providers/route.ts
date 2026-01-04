import { NextResponse } from "next/server";
import { getProviders } from "@/lib/verification";

export async function GET() {
    try {
        const providers = getProviders();

        return NextResponse.json({
            providers,
            activeSource: providers.length > 0 ? providers[0].name : 'none',
            nafdacEnabled: process.env.EMDEX_API_KEY ? true : false,
        });
    } catch (error) {
        console.error("Get providers error:", error);
        return NextResponse.json(
            { error: "Failed to get providers" },
            { status: 500 }
        );
    }
}
