import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';
import { Plus, Edit, Trash2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

async function getProducts() {
    return prisma.product.findMany({
        include: {
            brand: true,
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "authentic":
            return <span className="badge badge-success"><CheckCircle2 className="w-3 h-3" /> Authentic</span>;
        case "suspicious":
            return <span className="badge badge-warning"><AlertTriangle className="w-3 h-3" /> Suspicious</span>;
        case "fake":
            return <span className="badge badge-danger"><XCircle className="w-3 h-3" /> Fake</span>;
        default:
            return <span className="badge badge-neutral">Unknown</span>;
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Products</h1>
                    <p className="text-gray-400 mt-1">{products.length} products in database</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="w-full">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="text-left p-4 text-gray-400 font-medium">Barcode</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Brand</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Scans</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Reports</th>
                            <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-800/50">
                                <td className="p-4 text-gray-300 font-mono text-sm">{product.barcode || "-"}</td>
                                <td className="p-4 text-white font-medium">{product.name}</td>
                                <td className="p-4 text-gray-300">{product.brand?.name || "-"}</td>
                                <td className="p-4 text-gray-300">{product.category?.name || "-"}</td>
                                <td className="p-4"><StatusBadge status={product.verificationStatus} /></td>
                                <td className="p-4 text-gray-300">{product.authenticScans}</td>
                                <td className="p-4 text-gray-300">{product.fakeReportsCount}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-400">No products yet</p>
                        <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex">
                            <Plus className="w-4 h-4" />
                            Add First Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
