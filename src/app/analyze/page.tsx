"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
    Scan,
    ArrowLeft,
    Camera,
    Upload,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Eye,
    Sparkles,
    X
} from "lucide-react";

interface AnalysisIssue {
    type: string;
    severity: 'warning' | 'critical';
    description: string;
    confidence: number;
}

interface AnalysisResult {
    isLikelyFake: boolean;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    issues: AnalysisIssue[];
    extractedText?: string[];
    detectedBrands?: string[];
    suggestedAction: string;
    source: string;
}

export default function AIAnalyzePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setSelectedImage(base64);
            setResult(null);
            setError("");
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: selectedImage }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data.analysis);
            } else {
                setError(data.error || "Analysis failed");
            }
        } catch {
            setError("Failed to analyze image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setResult(null);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/scan" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">AI Analyzer</span>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4 max-w-xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">AI Product Analysis</h1>
                    <p className="text-gray-400 mt-2">
                        Upload a photo to detect potential counterfeits
                    </p>
                </div>

                {/* Image Upload Area */}
                <div className="card mb-6">
                    {!selectedImage ? (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageSelect}
                                className="hidden"
                                id="ai-image-upload"
                            />
                            <label
                                htmlFor="ai-image-upload"
                                className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-700 rounded-xl py-12 cursor-pointer hover:border-purple-500/50 hover:bg-gray-800/50 transition"
                            >
                                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-purple-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-medium">Take Photo or Upload</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Clear photo of product packaging
                                    </p>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                                <img
                                    src={selectedImage}
                                    alt="Selected product"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-900/80 text-white flex items-center justify-center hover:bg-red-500 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {!result && (
                                <button
                                    onClick={analyzeImage}
                                    disabled={isAnalyzing}
                                    className="btn-primary w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Analyze for Counterfeits
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="card bg-red-500/10 border-red-500/30 mb-6">
                        <div className="flex items-center gap-3 text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Analysis Results */}
                {result && (
                    <div className="space-y-4">
                        {/* Main Result Card */}
                        <div className={`card border-2 ${getRiskColor(result.riskLevel)}`}>
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${result.isLikelyFake ? 'bg-red-500/20' : 'bg-emerald-500/20'
                                    }`}>
                                    {result.isLikelyFake ? (
                                        <XCircle className="w-8 h-8 text-red-400" />
                                    ) : (
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${result.isLikelyFake ? 'text-red-400' : 'text-emerald-400'
                                        }`}>
                                        {result.isLikelyFake ? 'Likely Counterfeit' : 'Looks Authentic'}
                                    </h3>
                                    <p className="text-gray-400 mt-1">
                                        {result.confidence}% confidence • {result.riskLevel} risk
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Issues Found */}
                        {result.issues.length > 0 && (
                            <div className="card">
                                <h4 className="text-white font-semibold mb-3">Issues Detected</h4>
                                <ul className="space-y-2">
                                    {result.issues.map((issue, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-start gap-3 p-3 rounded-lg ${issue.severity === 'critical'
                                                    ? 'bg-red-500/10 border border-red-500/20'
                                                    : 'bg-yellow-500/10 border border-yellow-500/20'
                                                }`}
                                        >
                                            <AlertTriangle className={`w-5 h-5 mt-0.5 ${issue.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                                                }`} />
                                            <div>
                                                <p className={issue.severity === 'critical' ? 'text-red-300' : 'text-yellow-300'}>
                                                    {issue.description}
                                                </p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {issue.confidence}% confidence
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Detected Brands */}
                        {result.detectedBrands && result.detectedBrands.length > 0 && (
                            <div className="card">
                                <h4 className="text-white font-semibold mb-2">Brands Detected</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.detectedBrands.map((brand, index) => (
                                        <span key={index} className="badge badge-neutral">{brand}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggested Action */}
                        <div className="card bg-purple-500/10 border-purple-500/30">
                            <h4 className="text-purple-400 font-semibold mb-2">Recommended Action</h4>
                            <p className="text-gray-300">{result.suggestedAction}</p>
                        </div>

                        {/* Try Again Button */}
                        <button onClick={clearImage} className="btn-secondary w-full">
                            <Camera className="w-4 h-4" />
                            Analyze Another Product
                        </button>

                        {/* Source Info */}
                        <p className="text-center text-gray-500 text-sm">
                            Analysis powered by {result.source === 'openai' ? 'OpenAI Vision' : 'Local Analysis'}
                        </p>
                    </div>
                )}

                {/* Info Section */}
                {!result && !selectedImage && (
                    <div className="card bg-gray-800/50">
                        <h3 className="text-white font-semibold mb-3">What we detect:</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Spelling errors on packaging
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Logo and branding inconsistencies
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Print quality issues
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Missing regulatory information
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Barcode and labeling problems
                            </li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
