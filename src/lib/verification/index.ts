/**
 * Verification Module
 * 
 * Exports the verification service with all registered providers.
 * 
 * Usage:
 * ```typescript
 * import { verify, getProviders } from '@/lib/verification';
 * 
 * const result = await verify('5449000000996');
 * console.log(result.status); // 'authentic' | 'suspicious' | 'fake' | 'unknown' | 'not_found'
 * ```
 */

import { verificationService, VerificationResult, VerificationStatus } from './service';
import { localDatabaseProvider } from './providers/local';
import { nafdacProvider } from './providers/nafdac';

// Register all providers
verificationService.registerProvider(nafdacProvider);  // Priority 10 (highest when available)
verificationService.registerProvider(localDatabaseProvider);  // Priority 100 (fallback)

/**
 * Verify a product by barcode
 */
export async function verify(barcode: string): Promise<VerificationResult> {
    return verificationService.verify(barcode);
}

/**
 * Get list of registered verification providers
 */
export function getProviders(): { name: string; priority: number }[] {
    return verificationService.getProviders();
}

// Re-export types
export type { VerificationResult, VerificationStatus };
export { verificationService };
