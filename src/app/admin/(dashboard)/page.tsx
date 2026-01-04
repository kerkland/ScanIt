import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Package,
    Building2,
    Tags,
    Flag,
    Store,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Plus
} from "lucide-react";

async function getStats() {
    const [products, brands, categories, reports, merchants, scans] = await Promise.all([
        prisma.product.count(),
        prisma.brand.count(),
        prisma.category.count(),
        prisma.report.count(),
        prisma.merchant.count(),
        prisma.scan.count(),
    ]);

    const pendingReports = await prisma.report.count({
        where: { status: "pending" }
    });

    const fakeProducts = await prisma.product.count({
        where: { verificationStatus: "fake" }
    });

    return { products, brands, categories, reports, merchants, scans, pendingReports, fakeProducts };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        { label: "Products", value: stats.products, icon: Package, href: "/admin/products", color: "emerald" },
        { label: "Brands", value: stats.brands, icon: Building2, href: "/admin/brands", color: "blue" },
        { label: "Categories", value: stats.categories, icon: Tags, href: "/admin/categories", color: "purple" },
        { label: "Merchants", value: stats.merchants, icon: Store, href: "/admin/merchants", color: "indigo" },
        { label: "Total Scans", value: stats.scans, icon: TrendingUp, href: "#", color: "cyan" },
        { label: "Reports", value: stats.reports, icon: Flag, href: "/admin/reports", color: "yellow" },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Overview of your ScanIt platform</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="card group hover:border-emerald-500/50"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{card.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg bg-${card.color}-500/10 flex items-center justify-center`}>
                                <card.icon className={`w-6 h-6 text-${card.color}-400`} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.pendingReports > 0 && (
                    <Link href="/admin/reports?status=pending" className="card bg-yellow-500/10 border-yellow-500/30">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="w-8 h-8 text-yellow-400" />
                            <div>
                                <p className="text-yellow-400 font-semibold">{stats.pendingReports} Pending Reports</p>
                                <p className="text-gray-400 text-sm">Review and approve/reject</p>
                            </div>
                        </div>
                    </Link>
                )}

                {stats.fakeProducts > 0 && (
                    <div className="card bg-red-500/10 border-red-500/30">
                        <div className="flex items-center gap-4">
                            <Flag className="w-8 h-8 text-red-400" />
                            <div>
                                <p className="text-red-400 font-semibold">{stats.fakeProducts} Products Flagged as Fake</p>
                                <p className="text-gray-400 text-sm">Based on community reports</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/products/new" className="btn-secondary justify-center">
                        <Package className="w-4 h-4" />
                        Add Product
                    </Link>
                    <Link href="/admin/brands/new" className="btn-secondary justify-center">
                        <Building2 className="w-4 h-4" />
                        Add Brand
                    </Link>
                    <Link href="/admin/merchants/new" className="btn-secondary justify-center">
                        <Store className="w-4 h-4" />
                        Add Merchant
                    </Link>
                    <Link href="/admin/reports" className="btn-secondary justify-center">
                        <Flag className="w-4 h-4" />
                        Review Reports
                    </Link>
                </div>
            </div>
        </div>
    );
}
