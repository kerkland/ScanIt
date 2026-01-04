import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
} from "lucide-react";

export const dynamic = 'force-dynamic';

async function isAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
}

export default async function AdminManufacturersPage() {
    const authenticated = await isAdmin();
    if (!authenticated) {
        redirect("/admin-login");
    }

    const manufacturers = await prisma.manufacturer.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });

    const pending = manufacturers.filter((m) => !m.isApproved);
    const approved = manufacturers.filter((m) => m.isApproved);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manufacturers</h1>
                    <p className="text-gray-400">Approve and manage manufacturer accounts</p>
                </div>
                <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card text-center">
                    <p className="text-3xl font-bold text-white">{manufacturers.length}</p>
                    <p className="text-gray-400">Total</p>
                </div>
                <div className="card text-center">
                    <p className="text-3xl font-bold text-yellow-400">{pending.length}</p>
                    <p className="text-gray-400">Pending Approval</p>
                </div>
                <div className="card text-center">
                    <p className="text-3xl font-bold text-emerald-400">{approved.length}</p>
                    <p className="text-gray-400">Approved</p>
                </div>
            </div>

            {/* Pending Approvals */}
            {pending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Pending Approval ({pending.length})
                    </h2>
                    <div className="space-y-4">
                        {pending.map((mfr) => (
                            <div key={mfr.id} className="card border-yellow-500/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-white font-medium text-lg">{mfr.companyName}</h3>
                                        <p className="text-gray-400 text-sm">{mfr.email}</p>
                                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                            {mfr.phone && <span>📞 {mfr.phone}</span>}
                                            {mfr.city && <span>📍 {mfr.city}, {mfr.state}</span>}
                                        </div>
                                        {mfr.nafdacLicense && (
                                            <p className="text-gray-400 text-sm mt-1">NAFDAC: {mfr.nafdacLicense}</p>
                                        )}
                                        {mfr.cacNumber && (
                                            <p className="text-gray-400 text-sm">CAC: {mfr.cacNumber}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <form action={`/api/admin/manufacturers/${mfr.id}/approve`} method="POST">
                                            <button className="flex items-center gap-1 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approve
                                            </button>
                                        </form>
                                        <form action={`/api/admin/manufacturers/${mfr.id}/reject`} method="POST">
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

            {/* Approved Manufacturers */}
            <div>
                <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Approved Manufacturers ({approved.length})
                </h2>
                {approved.length === 0 ? (
                    <div className="card text-center py-8">
                        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No approved manufacturers yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {approved.map((mfr) => (
                            <div key={mfr.id} className="card border-emerald-500/30">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-medium">{mfr.companyName}</h3>
                                        <p className="text-gray-400 text-sm">{mfr.email}</p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {mfr._count.products} product submissions
                                        </p>
                                    </div>
                                    <span className="text-emerald-400 text-sm">✓ Approved</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
