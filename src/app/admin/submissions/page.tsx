import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Package,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
    Building2,
} from "lucide-react";

export const dynamic = 'force-dynamic';

async function isAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
}

export default async function AdminSubmissionsPage() {
    const authenticated = await isAdmin();
    if (!authenticated) {
        redirect("/admin-login");
    }

    const submissions = await prisma.productSubmission.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            manufacturer: true,
        },
    });

    const pending = submissions.filter((s) => s.status === "pending");
    const reviewed = submissions.filter((s) => s.status !== "pending");

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Product Submissions</h1>
                    <p className="text-gray-400">Review and approve product submissions from manufacturers</p>
                </div>
                <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card text-center">
                    <p className="text-3xl font-bold text-white">{submissions.length}</p>
                    <p className="text-gray-400">Total</p>
                </div>
                <div className="card text-center">
                    <p className="text-3xl font-bold text-yellow-400">{pending.length}</p>
                    <p className="text-gray-400">Pending Review</p>
                </div>
                <div className="card text-center">
                    <p className="text-3xl font-bold text-emerald-400">{reviewed.length}</p>
                    <p className="text-gray-400">Reviewed</p>
                </div>
            </div>

            {/* Pending */}
            {pending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Pending Review ({pending.length})
                    </h2>
                    <div className="space-y-4">
                        {pending.map((sub) => (
                            <div key={sub.id} className="card border-yellow-500/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-white font-medium text-lg">{sub.name}</h3>
                                        <p className="text-gray-400 text-sm">Barcode: {sub.barcode}</p>
                                        <p className="text-gray-500 text-sm">
                                            By: {sub.manufacturer.companyName}
                                        </p>
                                        {sub.nafdacRegNo && (
                                            <p className="text-gray-400 text-sm mt-1">NAFDAC: {sub.nafdacRegNo}</p>
                                        )}
                                        {sub.description && (
                                            <p className="text-gray-500 text-sm mt-2">{sub.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <form action={`/api/admin/submissions/${sub.id}/approve`} method="POST">
                                            <button className="flex items-center gap-1 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approve
                                            </button>
                                        </form>
                                        <form action={`/api/admin/submissions/${sub.id}/reject`} method="POST">
                                            <button className="flex items-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviewed */}
            <div>
                <h2 className="text-lg font-semibold text-gray-400 mb-4">
                    Reviewed ({reviewed.length})
                </h2>
                {reviewed.length === 0 ? (
                    <div className="card text-center py-8">
                        <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No reviewed submissions yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviewed.map((sub) => (
                            <div key={sub.id} className="card">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-medium">{sub.name}</h3>
                                        <p className="text-gray-400 text-sm">Barcode: {sub.barcode}</p>
                                        <p className="text-gray-500 text-sm">By: {sub.manufacturer.companyName}</p>
                                    </div>
                                    {sub.status === "approved" ? (
                                        <span className="flex items-center gap-1 text-emerald-400 text-sm">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-400 text-sm">
                                            <XCircle className="w-4 h-4" />
                                            Rejected
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
