import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
    LayoutDashboard,
    Package,
    Building2,
    Tags,
    Flag,
    Store,
    LogOut,
    Scan
} from "lucide-react";

// Simple admin check - in production, use proper auth
async function isAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAdmin();

    if (!authenticated) {
        redirect("/admin-login");
    }

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/products", icon: Package, label: "Products" },
        { href: "/admin/brands", icon: Building2, label: "Brands" },
        { href: "/admin/categories", icon: Tags, label: "Categories" },
        { href: "/admin/manufacturers", icon: Building2, label: "Manufacturers" },
        { href: "/admin/submissions", icon: Package, label: "Submissions" },
        { href: "/admin/reports", icon: Flag, label: "Reports" },
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white">ScanIt</span>
                            <span className="text-xs text-gray-400 block">Admin</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <form action="/api/admin/logout" method="POST">
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
