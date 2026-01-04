"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Scan,
    Building2,
    Mail,
    Lock,
    Phone,
    MapPin,
    FileText,
    Globe,
    Loader2,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

export default function ManufacturerRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        nafdacLicense: "",
        cacNumber: "",
        website: "",
    });

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
        "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
        "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
        "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
        "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/manufacturer/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="card max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                    <p className="text-gray-400 mb-6">
                        Your account is pending admin approval. You&apos;ll be able to submit products once approved.
                    </p>
                    <Link href="/manufacturer/login" className="btn-primary inline-flex">
                        Go to Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        );
    }

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
                    <Link href="/manufacturer/login" className="text-emerald-400 hover:text-emerald-300 text-sm">
                        Already have an account?
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Manufacturer Registration
                    </h1>
                    <p className="text-gray-400">
                        Register your company to add verified products to ScanIt
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Details */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    required
                                    placeholder="company@example.com"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        <Lock className="w-4 h-4 inline mr-2" />
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Min 8 characters"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                                        required
                                        placeholder="Repeat password"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Company Information</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <Building2 className="w-4 h-4 inline mr-2" />
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => updateField("companyName", e.target.value)}
                                    required
                                    placeholder="Your Company Ltd"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        placeholder="+234 xxx xxx xxxx"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        <Globe className="w-4 h-4 inline mr-2" />
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => updateField("website", e.target.value)}
                                        placeholder="https://yourcompany.com"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                    placeholder="Company address"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => updateField("city", e.target.value)}
                                        placeholder="Lagos"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">State</label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => updateField("state", e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">Select state</option>
                                        {nigerianStates.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regulatory Information */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Regulatory Information</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    NAFDAC Manufacturing License
                                </label>
                                <input
                                    type="text"
                                    value={formData.nafdacLicense}
                                    onChange={(e) => updateField("nafdacLicense", e.target.value)}
                                    placeholder="License number (if applicable)"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    CAC Registration Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.cacNumber}
                                    onChange={(e) => updateField("cacNumber", e.target.value)}
                                    placeholder="RC XXXXXXX"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <Building2 className="w-5 h-5" />
                                Register Company
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                </p>
            </main>
        </div>
    );
}
