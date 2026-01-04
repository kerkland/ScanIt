import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getBrands() {
    return prisma.brand.findMany({
        include: {
            _count: { select: { products: true } }
        },
        orderBy: { name: "asc" },
    });
}

export default async function BrandsPage() {
    const brands = await getBrands();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Brands</h1>
                    <p className="text-gray-400 mt-1">{brands.length} brands in database</p>
                </div>
                <Link href="/admin/brands/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Brand
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {brands.map((brand) => (
                    <div key={brand.id} className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{brand.name}</h3>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">{brand._count.products} products</p>
                        {brand.isOfficialPartner && (
                            <span className="badge badge-success mt-2 text-xs">Official Partner</span>
                        )}
                    </div>
                ))}

                {brands.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400">No brands yet</p>
                        <Link href="/admin/brands/new" className="btn-primary mt-4 inline-flex">
                            <Plus className="w-4 h-4" />
                            Add First Brand
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
