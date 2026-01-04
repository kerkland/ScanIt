import { redirect } from "next/navigation";
import { getCurrentManufacturer } from "@/lib/manufacturer-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Package,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Building2,
    LogOut,
    Scan,
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ManufacturerDashboardPage() {
    const manufacturer = await getCurrentManufacturer();

    if (!manufacturer) {
        redirect("/manufacturer/login");
    }

    // Get product submissions
    const submissions = await prisma.productSubmission.findMany({
        where: { manufacturerId: manufacturer.id },
        orderBy: { createdAt: "desc" },
    });

    const stats = {
        total: submissions.length,
        pending: submissions.filter((s) => s.status === "pending").length,
        approved: submissions.filter((s) => s.status === "approved").length,
        rejected: submissions.filter((s) => s.status === "rejected").length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                    </span>
                );
            case "rejected":
                return (
                    <span className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-500/10 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white">ScanIt</span>
                            <span className="text-xs text-gray-400 block">Manufacturer Portal</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">{manufacturer.companyName}</span>
                        <form action="/api/manufacturer/logout" method="POST">
                            <button className="text-gray-400 hover:text-white transition">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Approval Status Banner */}
                {!manufacturer.isApproved && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <div>
                            <p className="text-yellow-400 font-medium">Account Pending Approval</p>
                            <p className="text-gray-400 text-sm">
                                Your account is awaiting admin approval. You&apos;ll be able to submit products once approved.
                            </p>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card text-center">
                        <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                        <p className="text-gray-400 text-sm">Total Submissions</p>
                    </div>
                    <div className="card text-center">
                        <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{stats.pending}</p>
                        <p className="text-gray-400 text-sm">Pending</p>
                    </div>
                    <div className="card text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{stats.approved}</p>
                        <p className="text-gray-400 text-sm">Approved</p>
                    </div>
                    <div className="card text-center">
                        <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                        <p className="text-gray-400 text-sm">Rejected</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Your Products</h2>
                    {manufacturer.isApproved && (
                        <Link href="/manufacturer/products/new" className="btn-primary">
                            <Plus className="w-4 h-4" />
                            Submit New Product
                        </Link>
                    )}
                </div>

                {/* Submissions List */}
                {submissions.length === 0 ? (
                    <div className="card text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No products submitted yet</p>
                        {manufacturer.isApproved ? (
                            <Link href="/manufacturer/products/new" className="btn-primary inline-flex">
                                <Plus className="w-4 h-4" />
                                Submit Your First Product
                            </Link>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Wait for account approval to submit products
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <div key={submission.id} className="card flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-white font-medium">{submission.name}</h3>
                                        {getStatusBadge(submission.status)}
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Barcode: {submission.barcode}
                                        {submission.nafdacRegNo && ` • NAFDAC: ${submission.nafdacRegNo}`}
                                    </p>
                                    {submission.rejectionReason && (
                                        <p className="text-red-400 text-sm mt-1">
                                            Reason: {submission.rejectionReason}
                                        </p>
                                    )}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    {new Date(submission.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
