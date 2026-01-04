/**
 * Google Cloud Vision Provider
 * 
 * Uses Google Cloud Vision API for text detection and label analysis.
 * Good for OCR to find spelling errors on packaging.
 * 
 * To enable, set environment variable:
 * GOOGLE_CLOUD_API_KEY=your_api_key_here
 * 
 * Get your API key from: https://console.cloud.google.com/apis/credentials
 * Enable "Cloud Vision API" in your project.
 */

import { AIProvider, AnalysisResult, DetectedIssue } from '../service';

// Common misspellings found in counterfeit Nigerian products
const COMMON_MISSPELLINGS: Record<string, string> = {
    'nigera': 'Nigeria',
    'nafdec': 'NAFDAC',
    'manufatured': 'Manufactured',
    'ingredents': 'Ingredients',
    'expiry date': 'Expiry Date',
    'preservetives': 'Preservatives',
    'artifical': 'Artificial',
    'flavour': 'Flavor', // Could be intentional (British spelling)
    'colour': 'Color',   // Could be intentional (British spelling)
    'containts': 'Contains',
    'nutirtion': 'Nutrition',
    'vitamine': 'Vitamin',
    'suger': 'Sugar',
    'calcuim': 'Calcium',
    'protien': 'Protein',
};

// Suspicious text patterns often found on fakes
const SUSPICIOUS_PATTERNS = [
    /made in.*china/i,  // When product claims to be Nigerian/other
    /batch\s*:\s*$/i,   // Empty batch number
    /exp\s*:\s*$/i,     // Empty expiry
    /best\s+befor/i,    // Misspelling
];

export class GoogleVisionProvider implements AIProvider {
    name = 'Google Cloud Vision';
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    }

    async isAvailable(): Promise<boolean> {
        return !!this.apiKey;
    }

    async analyzeImage(imageData: string): Promise<AnalysisResult | null> {
        if (!this.apiKey) return null;

        try {
            // Extract base64 data (remove data URL prefix if present)
            let base64Image = imageData;
            if (imageData.includes(',')) {
                base64Image = imageData.split(',')[1];
            }

            // Call Google Cloud Vision API
            const response = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requests: [
                            {
                                image: { content: base64Image },
                                features: [
                                    { type: 'TEXT_DETECTION', maxResults: 50 },
                                    { type: 'LABEL_DETECTION', maxResults: 10 },
                                    { type: 'LOGO_DETECTION', maxResults: 5 },
                                ],
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Google Vision API error:', response.status, JSON.stringify(errorData));
                return null;
            }

            const data = await response.json();
            const result = data.responses?.[0];

            if (!result) return null;

            // Analyze the results
            return this.processVisionResults(result);
        } catch (error) {
            console.error('Google Vision analysis error:', error);
            return null;
        }
    }

    private processVisionResults(result: {
        textAnnotations?: Array<{ description: string }>;
        labelAnnotations?: Array<{ description: string; score: number }>;
        logoAnnotations?: Array<{ description: string; score: number }>;
    }): AnalysisResult {
        const issues: DetectedIssue[] = [];
        const extractedText: string[] = [];
        const detectedBrands: string[] = [];

        // Get full text
        const fullText = result.textAnnotations?.[0]?.description || '';
        const textLower = fullText.toLowerCase();

        // Extract individual text blocks
        result.textAnnotations?.slice(1).forEach((t) => {
            if (t.description.length > 2) {
                extractedText.push(t.description);
            }
        });

        // Check for spelling errors
        for (const [misspelling, correct] of Object.entries(COMMON_MISSPELLINGS)) {
            if (textLower.includes(misspelling.toLowerCase())) {
                issues.push({
                    type: 'spelling_error',
                    severity: 'critical',
                    description: `Found "${misspelling}" - should be "${correct}"`,
                    confidence: 95,
                });
            }
        }

        // Check for suspicious patterns
        for (const pattern of SUSPICIOUS_PATTERNS) {
            if (pattern.test(fullText)) {
                issues.push({
                    type: 'suspicious_text',
                    severity: 'warning',
                    description: `Suspicious text pattern detected`,
                    confidence: 70,
                });
            }
        }

        // Check for missing regulatory info
        const hasNAFDAC = /nafdac|a\d{1,2}-\d+/i.test(fullText);
        const hasExpiry = /exp|expiry|best before/i.test(fullText);
        const hasBatch = /batch|lot/i.test(fullText);

        if (!hasNAFDAC) {
            issues.push({
                type: 'missing_info',
                severity: 'critical',
                description: 'No NAFDAC registration number found',
                confidence: 80,
            });
        }

        if (!hasExpiry) {
            issues.push({
                type: 'missing_info',
                severity: 'warning',
                description: 'No expiry date visible',
                confidence: 70,
            });
        }

        if (!hasBatch) {
            issues.push({
                type: 'missing_info',
                severity: 'warning',
                description: 'No batch/lot number visible',
                confidence: 60,
            });
        }

        // Extract detected logos/brands
        result.logoAnnotations?.forEach((logo) => {
            if (logo.score > 0.5) {
                detectedBrands.push(logo.description);
            }
        });

        // Calculate overall risk
        const criticalCount = issues.filter((i) => i.severity === 'critical').length;
        const warningCount = issues.filter((i) => i.severity === 'warning').length;

        let overallRisk: 'low' | 'medium' | 'high' = 'low';
        let isLikelyFake = false;
        let confidence = 50;

        if (criticalCount >= 2) {
            overallRisk = 'high';
            isLikelyFake = true;
            confidence = 85;
        } else if (criticalCount >= 1 || warningCount >= 3) {
            overallRisk = 'medium';
            confidence = 65;
        } else if (warningCount >= 1) {
            overallRisk = 'low';
            confidence = 55;
        } else {
            confidence = 75; // No issues found = more confident it's real
        }

        return {
            isLikelyFake,
            confidence,
            overallRisk,
            issues,
            extractedText: extractedText.slice(0, 20), // Limit to 20 items
            detectedBrands,
            suggestedAction: isLikelyFake
                ? 'This product shows signs of counterfeiting. Do not consume and report to NAFDAC.'
                : issues.length > 0
                    ? 'Some issues detected. Compare with a known authentic product.'
                    : 'No obvious issues detected. Product appears legitimate.',
            source: 'google',
        };
    }
}

export const googleVisionProvider = new GoogleVisionProvider();
