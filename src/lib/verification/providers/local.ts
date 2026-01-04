/**
 * Local Database Provider
 * 
 * Uses the local SQLite/Prisma database as the verification source.
 * This is the default provider that works offline.
 */

import { prisma } from '@/lib/prisma';
import { VerificationProvider, VerificationResult } from '../service';

export class LocalDatabaseProvider implements VerificationProvider {
    name = 'Local Database';
    priority = 100; // Lowest priority - fallback

    async isAvailable(): Promise<boolean> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch {
            return false;
        }
    }

    async verify(barcode: string): Promise<VerificationResult | null> {
        const product = await prisma.product.findUnique({
            where: { barcode },
            include: {
                brand: true,
                category: true,
            },
        });

        if (!product) {
            return null;
        }

        // Increment scan count
        await prisma.product.update({
            where: { id: product.id },
            data: { authenticScans: { increment: 1 } },
        });

        // Calculate confidence based on verification status and scan count
        let confidence = 50;
        if (product.isVerified) confidence += 30;
        if (product.verificationStatus === 'authentic') confidence += 15;
        if (product.authenticScans > 100) confidence += 5;

        return {
            found: true,
            barcode,
            status: product.verificationStatus as VerificationResult['status'],
            confidence: Math.min(confidence, 100),
            product: {
                name: product.name,
                brand: product.brand?.name,
                category: product.category?.name,
                images: product.images ? JSON.parse(product.images) : undefined,
                isNAFDACRegistered: product.isVerified,
            },
            source: 'local',
            metadata: {
                productId: product.id,
                authenticScans: product.authenticScans,
                fakeReports: product.fakeReportsCount,
            },
        };
    }
}

export const localDatabaseProvider = new LocalDatabaseProvider();
