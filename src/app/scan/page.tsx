"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Scan,
    Camera,
    ArrowLeft,
    Search,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    HelpCircle,
    Loader2,
    X,
    Sparkles
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

type ScanResult = {
    found: boolean;
    product?: {
        id: string;
        name: string;
        brand?: string;
        category?: string;
        verificationStatus: string;
        fakeReportsCount: number;
        authenticScans: number;
        images?: string;
    };
    barcode: string;
};

export default function ScanPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [manualBarcode, setManualBarcode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const startScanner = async () => {
        setError(null);
        setScanResult(null);

        try {
            const html5QrCode = new Html5Qrcode("scanner-container");
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 100 },
                    aspectRatio: 1.0
                },
                async (decodedText) => {
                    await html5QrCode.stop();
                    setIsScanning(false);
                    await verifyProduct(decodedText);
                },
                () => { } // Ignore scan failures
            );

            setIsScanning(true);
        } catch (err) {
            console.error("Scanner error:", err);
            setError("Failed to access camera. Please allow camera permissions or enter barcode manually.");
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch (e) {
                // Ignore stop errors
            }
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const verifyProduct = async (barcode: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/products/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ barcode }),
            });

            const data = await response.json();
            setScanResult(data);

            // Log scan
            await fetch("/api/scans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    barcode,
                    scanType: "barcode",
                    result: data.found ? "found" : "not_found",
                    productId: data.product?.id,
                }),
            });
        } catch (err) {
            console.error("Verification error:", err);
            setError("Failed to verify product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (manualBarcode.trim()) {
            await verifyProduct(manualBarcode.trim());
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "authentic":
                return <CheckCircle2 className="w-16 h-16 text-emerald-400" />;
            case "suspicious":
                return <AlertTriangle className="w-16 h-16 text-yellow-400" />;
            case "fake":
                return <XCircle className="w-16 h-16 text-red-400" />;
            default:
                return <HelpCircle className="w-16 h-16 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "authentic":
                return <span className="badge badge-success">✅ Verified Authentic</span>;
            case "suspicious":
                return <span className="badge badge-warning">⚠️ Suspicious</span>;
            case "fake":
                return <span className="badge badge-danger">❌ Reported Fake</span>;
            default:
                return <span className="badge badge-neutral">❓ Unknown</span>;
        }
    };

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">ScanIt</span>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                    Scan a Product
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Scan the barcode or QR code to verify authenticity
                </p>

                {/* Scanner Area */}
                {!scanResult && !isLoading && (
                    <div className="card mb-6">
                        {isScanning ? (
                            <div className="relative">
                                <div
                                    id="scanner-container"
                                    ref={containerRef}
                                    className="w-full aspect-square rounded-lg overflow-hidden bg-black"
                                />
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-8 border-2 border-emerald-400 rounded-lg">
                                        <div className="scan-line"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={stopScanner}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={startScanner}
                                className="w-full py-16 flex flex-col items-center gap-4 text-gray-400 hover:text-emerald-400 transition group"
                            >
                                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition relative pulse-ring">
                                    <Camera className="w-12 h-12" />
                                </div>
                                <span className="text-lg font-medium">Tap to Scan</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Manual Search */}
                {!scanResult && !isLoading && !isScanning && (
                    <form onSubmit={handleManualSearch} className="card mb-6">
                        <label className="block text-sm text-gray-400 mb-2">
                            Or enter barcode manually
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={manualBarcode}
                                onChange={(e) => setManualBarcode(e.target.value)}
                                placeholder="Enter barcode number..."
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                            <button type="submit" className="btn-primary">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="card text-center py-16">
                        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Verifying product...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="card bg-red-500/10 border-red-500/20 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <p className="text-red-400">{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-sm text-gray-400 hover:text-white mt-2"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan Result */}
                {scanResult && (
                    <div className="card text-center">
                        {scanResult.found && scanResult.product ? (
                            <>
                                <div className="mb-4">
                                    {getStatusIcon(scanResult.product.verificationStatus)}
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {scanResult.product.name}
                                </h2>
                                {scanResult.product.brand && (
                                    <p className="text-gray-400 mb-4">{scanResult.product.brand}</p>
                                )}
                                <div className="mb-6">
                                    {getStatusBadge(scanResult.product.verificationStatus)}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-emerald-400">
                                            {scanResult.product.authenticScans}
                                        </div>
                                        <div className="text-sm text-gray-400">Authentic Scans</div>
                                    </div>
                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-red-400">
                                            {scanResult.product.fakeReportsCount}
                                        </div>
                                        <div className="text-sm text-gray-400">Fake Reports</div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-6">
                                    Barcode: {scanResult.barcode}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <Link href={`/report?barcode=${scanResult.barcode}`} className="btn-secondary">
                                        <AlertTriangle className="w-4 h-4" />
                                        Report as Fake
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setScanResult(null);
                                            setManualBarcode("");
                                        }}
                                        className="btn-primary"
                                    >
                                        <Scan className="w-4 h-4" />
                                        Scan Another
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Product Not Found
                                </h2>
                                <p className="text-gray-400 mb-2">
                                    Barcode: {scanResult.barcode}
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    This product is not in our database yet. Help us by adding it!
                                </p>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={`/report?barcode=${scanResult.barcode}&new=true`}
                                        className="btn-primary"
                                    >
                                        Add This Product
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setScanResult(null);
                                            setManualBarcode("");
                                        }}
                                        className="btn-secondary"
                                    >
                                        <Scan className="w-4 h-4" />
                                        Scan Another
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Tips */}
                {!scanResult && !isLoading && !isScanning && (
                    <div className="space-y-6">
                        <div className="text-center text-sm text-gray-500">
                            <p>💡 Tip: Hold your phone steady and ensure good lighting for best results</p>
                        </div>

                        {/* AI Analyzer Link */}
                        <Link href="/analyze" className="card block bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">AI Photo Analysis</h3>
                                    <p className="text-gray-400 text-sm">Upload a photo to detect counterfeits using AI</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
