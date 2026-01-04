/**
 * Local Heuristic Provider
 * 
 * Basic image analysis without external AI APIs.
 * Uses simple heuristics and patterns to detect obvious issues.
 * 
 * This is a fallback when no AI API is configured.
 */

import { AIProvider, AnalysisResult, DetectedIssue } from '../service';

// Common misspellings found in counterfeit Nigerian products
const COMMON_FAKE_INDICATORS = [
    { pattern: /nigera/i, description: 'Misspelling: "Nigera" instead of "Nigeria"' },
    { pattern: /nafdec/i, description: 'Misspelling: "NAFDEC" instead of "NAFDAC"' },
    { pattern: /manufatured/i, description: 'Misspelling: "Manufatured" instead of "Manufactured"' },
    { pattern: /ingredents/i, description: 'Misspelling: "Ingredents" instead of "Ingredients"' },
    { pattern: /expiry\s*:?\s*$/i, description: 'Missing expiry date' },
    { pattern: /batch\s*:?\s*$/i, description: 'Missing batch number' },
];

export class LocalHeuristicProvider implements AIProvider {
    name = 'Local Analysis';

    async isAvailable(): Promise<boolean> {
        // Always available as fallback
        return true;
    }

    async analyzeImage(imageData: string): Promise<AnalysisResult | null> {
        // Basic analysis - in a real implementation, this would use
        // OCR libraries like Tesseract.js to extract text

        const issues: DetectedIssue[] = [];

        // Check image size/quality from base64 length
        const imageSize = imageData.length;
        if (imageSize < 10000) {
            issues.push({
                type: 'print_quality',
                severity: 'warning',
                description: 'Image quality is low. Please provide a clearer photo.',
                confidence: 60,
            });
        }

        // Without actual OCR, we can only provide general guidance
        return {
            isLikelyFake: false,
            confidence: 30, // Low confidence without AI
            overallRisk: 'medium',
            issues: issues.length > 0 ? issues : [
                {
                    type: 'missing_info',
                    severity: 'warning',
                    description: 'Enable AI analysis for detailed counterfeit detection. Set OPENAI_API_KEY in environment.',
                    confidence: 100,
                }
            ],
            suggestedAction: 'For accurate analysis, enable AI features by adding your OpenAI API key. Manual verification recommended.',
            source: 'local',
        };
    }
}

export const localHeuristicProvider = new LocalHeuristicProvider();
