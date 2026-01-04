/**
 * AI Analysis Module
 * 
 * Exports the AI analysis service with all registered providers.
 * 
 * Usage:
 * ```typescript
 * import { analyzeImage } from '@/lib/ai';
 * 
 * const result = await analyzeImage(base64ImageData);
 * console.log(result.isLikelyFake, result.issues);
 * ```
 * 
 * Environment Variables:
 * - OPENAI_API_KEY: Enable OpenAI GPT-4 Vision analysis
 */

import { aiAnalysisService, AnalysisResult } from './service';
import { geminiProvider } from './providers/gemini';
import { openaiVisionProvider } from './providers/openai';
import { googleVisionProvider } from './providers/google';
import { localHeuristicProvider } from './providers/local';

// Register providers in order of preference
aiAnalysisService.registerProvider(geminiProvider);        // Priority 1 - FREE, best for Nigeria
aiAnalysisService.registerProvider(googleVisionProvider);  // Priority 2 - Good OCR
aiAnalysisService.registerProvider(openaiVisionProvider);  // Priority 3 - Best overall
aiAnalysisService.registerProvider(localHeuristicProvider);  // Fallback

/**
 * Analyze a product image for signs of counterfeiting
 */
export async function analyzeImage(imageData: string): Promise<AnalysisResult> {
    return aiAnalysisService.analyze(imageData);
}

/**
 * Get list of available AI providers
 */
export function getAIProviders(): string[] {
    return aiAnalysisService.getProviders();
}

// Re-export types
export type { AnalysisResult, DetectedIssue, IssueType } from './service';
export { aiAnalysisService };
