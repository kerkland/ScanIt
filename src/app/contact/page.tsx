"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Scan,
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    Send,
    MessageSquare,
    Loader2,
    CheckCircle2
} from "lucide-react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="card max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                    <p className="text-gray-400 mb-6">
                        Thank you for contacting us. We&apos;ll get back to you within 24-48 hours.
                    </p>
                    <Link href="/" className="btn-primary inline-flex">
                        Back to Home
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
                    <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-gray-400">Have questions? We&apos;d love to hear from you.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="card">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Get In Touch</h2>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Whether you have questions about how ScanIt works, want to report an issue,
                                or are interested in partnering with us, we&apos;re here to help.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-300">
                                    <Mail className="w-5 h-5 text-emerald-400" />
                                    <span>scanit546@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <Phone className="w-5 h-5 text-emerald-400" />
                                    <span>+234 (0) 800 SCANIT</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                    <span>Lagos, Nigeria</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">For Manufacturers</h3>
                            <p className="text-gray-400 mb-4">
                                Want to register your products on ScanIt? Create a manufacturer account to submit
                                your products for verification.
                            </p>
                            <Link href="/manufacturer/register" className="text-emerald-400 hover:text-emerald-300">
                                Register as Manufacturer →
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="report">Report Fake Product</option>
                                    <option value="partnership">Partnership Opportunity</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full py-4"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
