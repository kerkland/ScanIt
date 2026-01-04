import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get aggregated report locations for heat map
export async function GET() {
    try {
        // Get all reports with location data
        const reports = await prisma.report.findMany({
            where: {
                OR: [
                    { city: { not: null } },
                    { latitude: { not: null } },
                ],
            },
            select: {
                city: true,
                latitude: true,
                longitude: true,
                status: true,
                createdAt: true,
            },
        });

        // Aggregate by city
        const cityMap = new Map<string, { count: number; confirmed: number }>();

        for (const report of reports) {
            const city = report.city || "Unknown";
            const current = cityMap.get(city) || { count: 0, confirmed: 0 };
            current.count++;
            if (report.status === "confirmed") {
                current.confirmed++;
            }
            cityMap.set(city, current);
        }

        // Convert to array and sort by count
        const citySummary = Array.from(cityMap.entries())
            .map(([city, data]) => ({
                city,
                totalReports: data.count,
                confirmedFakes: data.confirmed,
            }))
            .sort((a, b) => b.totalReports - a.totalReports);

        // Get Nigerian city coordinates for map display
        const cityCoordinates: Record<string, { lat: number; lng: number }> = {
            "Lagos": { lat: 6.5244, lng: 3.3792 },
            "Abuja": { lat: 9.0579, lng: 7.4951 },
            "Kano": { lat: 12.0022, lng: 8.5920 },
            "Ibadan": { lat: 7.3775, lng: 3.9470 },
            "Port Harcourt": { lat: 4.8156, lng: 7.0498 },
            "Benin City": { lat: 6.3350, lng: 5.6037 },
            "Kaduna": { lat: 10.5222, lng: 7.4383 },
            "Enugu": { lat: 6.4584, lng: 7.5464 },
            "Onitsha": { lat: 6.1508, lng: 6.7857 },
            "Aba": { lat: 5.1066, lng: 7.3667 },
            "Warri": { lat: 5.5167, lng: 5.7500 },
            "Jos": { lat: 9.8965, lng: 8.8583 },
            "Ilorin": { lat: 8.4966, lng: 4.5426 },
            "Owerri": { lat: 5.4851, lng: 7.0352 },
            "Calabar": { lat: 4.9517, lng: 8.3220 },
            "Uyo": { lat: 5.0377, lng: 7.9128 },
            "Akure": { lat: 7.2526, lng: 5.1931 },
            "Abeokuta": { lat: 7.1475, lng: 3.3619 },
            "Osogbo": { lat: 7.7827, lng: 4.5418 },
            "Sokoto": { lat: 13.0629, lng: 5.2343 },
        };

        // Add coordinates to city data
        const heatMapData = citySummary.map((item) => ({
            ...item,
            coordinates: cityCoordinates[item.city] || null,
        }));

        // Get total stats
        const totalReports = reports.length;
        const confirmedFakes = reports.filter((r) => r.status === "confirmed").length;

        return NextResponse.json({
            heatMapData,
            stats: {
                totalReports,
                confirmedFakes,
                citiesAffected: citySummary.length,
            },
        });
    } catch (error) {
        console.error("Heat map data error:", error);
        return NextResponse.json(
            { error: "Failed to get heat map data" },
            { status: 500 }
        );
    }
}
