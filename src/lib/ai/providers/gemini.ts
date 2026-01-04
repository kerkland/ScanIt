/**
 * Google Gemini AI Provider
 * 
 * Uses Gemini 2.0 Flash for image analysis - FREE tier available!
 * No billing required for the free quota.
 * 
 * Get your API key from: https://aistudio.google.com/apikey
 * 
 * Set environment variable:
 * GEMINI_API_KEY=your_api_key_here
 */

import { AIProvider, AnalysisResult } from '../service';

const ANALYSIS_PROMPT = `You are an expert at detecting counterfeit products in Nigeria. Analyze this product image carefully for signs of counterfeiting.

Look for these common indicators of fake products:
1. Spelling errors or grammatical mistakes on labels (e.g., "Nigera" instead of "Nigeria", "NAFDEC" instead of "NAFDAC")
2. Poor print quality, blurry text, or misaligned labels
3. Incorrect or missing logos/branding elements
4. Wrong colors compared to authentic products
5. Missing regulatory information (NAFDAC number, expiry date, batch number)
6. Poor packaging quality (cheap materials, uneven cuts)
7. Suspicious barcodes (wrong format, missing, or damaged)
8. Generic or missing manufacturer information

Respond ONLY with valid JSON (no markdown, no code blocks) in this exact structure:
{
  "isLikelyFake": boolean,
  "confidence": number from 0 to 100,
  "overallRisk": "low" or "medium" or "high",
  "issues": [
    {
      "type": "spelling_error" or "logo_mismatch" or "packaging_quality" or "color_discrepancy" or "barcode_issue" or "missing_info" or "suspicious_text" or "print_quality" or "label_alignment",
      "severity": "warning" or "critical",
      "description": "Brief description of the issue",
      "confidence": number from 0 to 100
    }
  ],
  "extractedText": ["list of text found on packaging"],
  "detectedBrands": ["brand names detected"],
  "suggestedAction": "What the user should do next"
}`;

export class GeminiProvider implements AIProvider {
    name = 'Google Gemini';
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
    }

    async isAvailable(): Promise<boolean> {
        return !!this.apiKey;
    }

    async analyzeImage(imageData: string): Promise<AnalysisResult | null> {
        if (!this.apiKey) return null;

        try {
            // Extract base64 data and mime type
            let base64Image = imageData;
            let mimeType = 'image/jpeg';

            if (imageData.includes(',')) {
                const parts = imageData.split(',');
                base64Image = parts[1];
                // Extract mime type from data URL
                const mimeMatch = parts[0].match(/data:([^;]+);/);
                if (mimeMatch) {
                    mimeType = mimeMatch[1];
                }
            }

            // Call Gemini API
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: ANALYSIS_PROMPT },
                                    {
                                        inline_data: {
                                            mime_type: mimeType,
                                            data: base64Image,
                                        },
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 1024,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gemini API error:', response.status, JSON.stringify(errorData));
                return null;
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!content) {
                console.error('Gemini: No content in response');
                return null;
            }

            // Parse JSON from response (handle potential markdown code blocks)
            let jsonStr = content.trim();
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.slice(7);
            }
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.slice(3);
            }
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }
            jsonStr = jsonStr.trim();

            const analysis = JSON.parse(jsonStr);

            return {
                isLikelyFake: analysis.isLikelyFake,
                confidence: analysis.confidence,
                overallRisk: analysis.overallRisk,
                issues: analysis.issues || [],
                extractedText: analysis.extractedText || [],
                detectedBrands: analysis.detectedBrands || [],
                suggestedAction: analysis.suggestedAction || 'Verify with official sources.',
                source: 'google' as const,
            };
        } catch (error) {
            console.error('Gemini analysis error:', error);
            return null;
        }
    }
}

export const geminiProvider = new GeminiProvider();
