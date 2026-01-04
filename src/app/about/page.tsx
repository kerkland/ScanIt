import Link from "next/link";
import { Scan, Shield, Users, Target, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
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

            <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About <span className="text-emerald-400">ScanIt</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Fighting counterfeit products in Nigeria, one scan at a time.
                    </p>
                </div>

                {/* Mission */}
                <section className="card mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Target className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        Counterfeit products cost Nigeria billions of naira annually and pose serious health risks to millions of citizens.
                        From fake medications to adulterated food and beverages, the problem affects everyone.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                        ScanIt was created to empower Nigerian consumers with a simple tool to verify products before purchasing.
                        By scanning a barcode, users can instantly check if a product is genuine, reported as fake, or unknown.
                    </p>
                </section>

                {/* How It Works */}
                <section className="card mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">How It Works</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            "Scan any product barcode using your phone camera",
                            "Our database checks the product against verified brands",
                            "Get instant feedback: authentic, suspicious, or fake",
                            "Report fake products to help protect other consumers",
                            "Community reports help identify counterfeit hotspots",
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Our Team</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        ScanIt is built by a passionate team of Nigerian developers and designers committed to making
                        commerce safer for everyone. We will be working closely with NAFDAC and verified manufacturers to maintain
                        an accurate database of genuine products.
                    </p>
                    <div className="mt-6">
                        <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">
                            Get in touch with us →
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
