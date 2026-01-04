/**
 * Verification Service Architecture
 * 
 * This module provides a pluggable architecture for product verification.
 * It allows switching between different data sources:
 * - Local database (default)
 * - NAFDAC Greenbook (future)
 * - EMDEX API (future)
 * - Custom APIs (future)
 */

export type VerificationStatus = 'authentic' | 'suspicious' | 'fake' | 'unknown' | 'not_found';

export interface VerificationResult {
    found: boolean;
    barcode: string;
    status: VerificationStatus;
    confidence: number; // 0-100
    product?: {
        name: string;
        brand?: string;
        category?: string;
        manufacturer?: string;
        registrationNumber?: string;
        expiryDate?: string;
        countryOfOrigin?: string;
        isNAFDACRegistered?: boolean;
        images?: string[];
    };
    source: 'local' | 'nafdac' | 'emdex' | 'external';
    warnings?: string[];
    metadata?: Record<string, unknown>;
}

export interface VerificationProvider {
    name: string;
    priority: number; // Lower = higher priority
    isAvailable(): Promise<boolean>;
    verify(barcode: string): Promise<VerificationResult | null>;
}

/**
 * Verification Service
 * 
 * Orchestrates multiple verification providers and returns the best result.
 * Providers are tried in order of priority until a result is found.
 */
export class VerificationService {
    private providers: VerificationProvider[] = [];

    registerProvider(provider: VerificationProvider): void {
        this.providers.push(provider);
        this.providers.sort((a, b) => a.priority - b.priority);
    }

    async verify(barcode: string): Promise<VerificationResult> {
        // Try each provider in priority order
        for (const provider of this.providers) {
            try {
                const isAvailable = await provider.isAvailable();
                if (!isAvailable) continue;

                const result = await provider.verify(barcode);
                if (result && result.found) {
                    return result;
                }
            } catch (error) {
                console.error(`Provider ${provider.name} failed:`, error);
                continue;
            }
        }

        // No provider found the product
        return {
            found: false,
            barcode,
            status: 'not_found',
            confidence: 0,
            source: 'local',
            warnings: ['Product not found in any database. This does not mean it is fake.'],
        };
    }

    getProviders(): { name: string; priority: number }[] {
        return this.providers.map(p => ({ name: p.name, priority: p.priority }));
    }
}

// Singleton instance
export const verificationService = new VerificationService();
