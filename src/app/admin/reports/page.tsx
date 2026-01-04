import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Eye } from "lucide-react";

async function getReports() {
    return prisma.report.findMany({
        include: {
            product: true,
            merchant: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "confirmed":
            return <span className="badge badge-danger"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
        case "rejected":
            return <span className="badge badge-success"><XCircle className="w-3 h-3" /> Rejected</span>;
        case "reviewing":
            return <span className="badge badge-warning"><Eye className="w-3 h-3" /> Reviewing</span>;
        default:
            return <span className="badge badge-neutral"><Clock className="w-3 h-3" /> Pending</span>;
    }
}

export default async function ReportsPage() {
    const reports = await getReports();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Reports</h1>
                    <p className="text-gray-400 mt-1">{reports.length} community reports</p>
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="w-full">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Product</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Barcode</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                            <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-800/50">
                                <td className="p-4 text-gray-300 text-sm">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-white font-medium">
                                    {report.product?.name || report.productName || "Unknown"}
                                </td>
                                <td className="p-4 text-gray-300 font-mono text-sm">
                                    {report.barcode || "-"}
                                </td>
                                <td className="p-4 text-gray-300 text-sm">
                                    {report.purchaseLocation || report.city || "-"}
                                </td>
                                <td className="p-4"><StatusBadge status={report.status} /></td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/reports/${report.id}`}
                                            className="btn-secondary text-sm py-1"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {reports.length === 0 && (
                    <div className="p-12 text-center">
                        <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No reports yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
