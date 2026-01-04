/**
 * OpenAI Vision Provider
 * 
 * Uses GPT-4 Vision to analyze product images for counterfeiting signs.
 * 
 * To enable, set environment variable:
 * OPENAI_API_KEY=your_api_key_here
 */

import { AIProvider, AnalysisResult, DetectedIssue } from '../service';

const ANALYSIS_PROMPT = `You are an expert at detecting counterfeit products. Analyze this product image carefully for signs of counterfeiting.

Look for these common indicators of fake products:
1. Spelling errors or grammatical mistakes on labels
2. Poor print quality, blurry text, or misaligned labels
3. Incorrect or missing logos/branding elements
4. Wrong colors compared to authentic products
5. Missing regulatory information (NAFDAC number, expiry date, batch number)
6. Poor packaging quality (cheap materials, uneven cuts)
7. Suspicious barcodes (wrong format, missing, or damaged)
8. Generic or missing manufacturer information

Respond in JSON format with this structure:
{
  "isLikelyFake": boolean,
  "confidence": number (0-100),
  "overallRisk": "low" | "medium" | "high",
  "issues": [
    {
      "type": "spelling_error" | "logo_mismatch" | "packaging_quality" | "color_discrepancy" | "barcode_issue" | "missing_info" | "suspicious_text" | "print_quality" | "label_alignment",
      "severity": "warning" | "critical",
      "description": "Brief description of the issue",
      "confidence": number (0-100)
    }
  ],
  "extractedText": ["list of text found on packaging"],
  "detectedBrands": ["brand names detected"],
  "suggestedAction": "What the user should do next"
}`;

export class OpenAIVisionProvider implements AIProvider {
    name = 'OpenAI Vision';
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
    }

    async isAvailable(): Promise<boolean> {
        return !!this.apiKey;
    }

    async analyzeImage(imageData: string): Promise<AnalysisResult | null> {
        if (!this.apiKey) return null;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: ANALYSIS_PROMPT },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`,
                                    },
                                },
                            ],
                        },
                    ],
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                console.error('OpenAI API error:', response.status);
                return null;
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (!content) return null;

            // Parse JSON from response (handle markdown code blocks)
            let jsonStr = content;
            if (content.includes('```json')) {
                jsonStr = content.split('```json')[1].split('```')[0];
            } else if (content.includes('```')) {
                jsonStr = content.split('```')[1].split('```')[0];
            }

            const analysis = JSON.parse(jsonStr.trim());

            return {
                isLikelyFake: analysis.isLikelyFake,
                confidence: analysis.confidence,
                overallRisk: analysis.overallRisk,
                issues: analysis.issues || [],
                extractedText: analysis.extractedText || [],
                detectedBrands: analysis.detectedBrands || [],
                suggestedAction: analysis.suggestedAction || 'Verify with official sources.',
                source: 'openai',
            };
        } catch (error) {
            console.error('OpenAI Vision analysis error:', error);
            return null;
        }
    }
}

export const openaiVisionProvider = new OpenAIVisionProvider();
