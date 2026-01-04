import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

async function getCategories() {
    return prisma.category.findMany({
        include: {
            _count: { select: { products: true } }
        },
        orderBy: { name: "asc" },
    });
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Categories</h1>
                    <p className="text-gray-400 mt-1">{categories.length} categories</p>
                </div>
                <Link href="/admin/categories/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Category
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <div key={category.id} className="card">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{category.icon || "📦"}</span>
                                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">{category._count.products} products</p>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400">No categories yet</p>
                        <Link href="/admin/categories/new" className="btn-primary mt-4 inline-flex">
                            <Plus className="w-4 h-4" />
                            Add First Category
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
