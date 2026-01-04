/**
 * AI Image Analysis Service
 * 
 * Analyzes product images for signs of counterfeiting using AI.
 * Supports multiple AI providers:
 * - OpenAI GPT-4 Vision
 * - Google Cloud Vision
 * - Local heuristic analysis (fallback)
 * 
 * Detection capabilities:
 * - Text extraction and spell checking
 * - Logo/branding consistency
 * - Packaging quality assessment
 * - Barcode visibility and format
 * - Color accuracy compared to known products
 */

export interface AnalysisResult {
    isLikelyFake: boolean;
    confidence: number; // 0-100
    overallRisk: 'low' | 'medium' | 'high';
    issues: DetectedIssue[];
    extractedText?: string[];
    detectedBrands?: string[];
    suggestedAction: string;
    source: 'openai' | 'google' | 'local';
}

export interface DetectedIssue {
    type: IssueType;
    severity: 'warning' | 'critical';
    description: string;
    confidence: number;
}

export type IssueType =
    | 'spelling_error'
    | 'logo_mismatch'
    | 'packaging_quality'
    | 'color_discrepancy'
    | 'barcode_issue'
    | 'missing_info'
    | 'suspicious_text'
    | 'print_quality'
    | 'label_alignment';

export interface AIProvider {
    name: string;
    isAvailable(): Promise<boolean>;
    analyzeImage(imageData: string): Promise<AnalysisResult | null>;
}

/**
 * AI Analysis Service
 * 
 * Orchestrates image analysis across multiple AI providers.
 */
export class AIAnalysisService {
    private providers: AIProvider[] = [];

    registerProvider(provider: AIProvider): void {
        this.providers.push(provider);
    }

    async analyze(imageData: string): Promise<AnalysisResult> {
        // Try each provider until one succeeds
        for (const provider of this.providers) {
            try {
                const available = await provider.isAvailable();
                if (!available) continue;

                const result = await provider.analyzeImage(imageData);
                if (result) {
                    return result;
                }
            } catch (error) {
                console.error(`AI Provider ${provider.name} failed:`, error);
                continue;
            }
        }

        // Fallback: return unable to analyze
        return {
            isLikelyFake: false,
            confidence: 0,
            overallRisk: 'low',
            issues: [],
            suggestedAction: 'Could not analyze image. Please try again or verify manually.',
            source: 'local',
        };
    }

    getProviders(): string[] {
        return this.providers.map(p => p.name);
    }
}

export const aiAnalysisService = new AIAnalysisService();
