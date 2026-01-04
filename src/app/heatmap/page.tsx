"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Scan,
    ArrowLeft,
    MapPin,
    AlertTriangle,
    TrendingUp,
    Building2,
    Flame,
} from "lucide-react";

interface CityData {
    city: string;
    totalReports: number;
    confirmedFakes: number;
    coordinates: { lat: number; lng: number } | null;
}

interface HeatMapResponse {
    heatMapData: CityData[];
    stats: {
        totalReports: number;
        confirmedFakes: number;
        citiesAffected: number;
    };
}

export default function HeatMapPage() {
    const [data, setData] = useState<HeatMapResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/reports/heatmap")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const getHeatLevel = (count: number, max: number) => {
        const ratio = count / max;
        if (ratio > 0.7) return { color: "bg-red-500", label: "High Risk" };
        if (ratio > 0.4) return { color: "bg-orange-500", label: "Medium Risk" };
        if (ratio > 0.2) return { color: "bg-yellow-500", label: "Low Risk" };
        return { color: "bg-emerald-500", label: "Minimal" };
    };

    const maxReports = data?.heatMapData[0]?.totalReports || 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">ScanIt</span>
                    </Link>
                    <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <Flame className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Counterfeit <span className="text-red-400">Heat Map</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        See where fake products are being reported across Nigeria. Help protect yourself and your community.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading heat map data...</p>
                    </div>
                ) : data ? (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="card text-center">
                                <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-white">{data.stats.totalReports}</p>
                                <p className="text-gray-400 text-sm">Total Reports</p>
                            </div>
                            <div className="card text-center">
                                <TrendingUp className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-white">{data.stats.confirmedFakes}</p>
                                <p className="text-gray-400 text-sm">Confirmed Fakes</p>
                            </div>
                            <div className="card text-center">
                                <Building2 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-white">{data.stats.citiesAffected}</p>
                                <p className="text-gray-400 text-sm">Cities Affected</p>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="card mb-8">
                            <h3 className="text-white font-semibold mb-4">Risk Level Legend</h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-red-500"></div>
                                    <span className="text-gray-300 text-sm">High Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                                    <span className="text-gray-300 text-sm">Medium Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                                    <span className="text-gray-300 text-sm">Low Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-emerald-500"></div>
                                    <span className="text-gray-300 text-sm">Minimal</span>
                                </div>
                            </div>
                        </div>

                        {/* City List with Heat Bars */}
                        <div className="card">
                            <h2 className="text-xl font-bold text-white mb-6">Reports by City</h2>

                            {data.heatMapData.length === 0 ? (
                                <div className="text-center py-8">
                                    <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">No location data available yet.</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Reports with location data will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.heatMapData.map((city, index) => {
                                        const heat = getHeatLevel(city.totalReports, maxReports);
                                        const widthPercent = (city.totalReports / maxReports) * 100;

                                        return (
                                            <div key={city.city} className="relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                                                        <MapPin className={`w-4 h-4 ${heat.color.replace("bg-", "text-")}`} />
                                                        <span className="text-white font-medium">{city.city}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-xs px-2 py-1 rounded ${heat.color} text-white`}>
                                                            {heat.label}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">
                                                            {city.totalReports} reports
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${heat.color} transition-all duration-500`}
                                                        style={{ width: `${widthPercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Call to Action */}
                        <div className="card mt-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">Spotted a Fake Product?</h3>
                                    <p className="text-gray-400 text-sm">
                                        Help protect others by reporting counterfeit products in your area.
                                    </p>
                                </div>
                                <Link href="/report" className="btn-primary flex-shrink-0">
                                    Report Now
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-red-400">Failed to load heat map data</p>
                    </div>
                )}
            </main>
        </div>
    );
}
