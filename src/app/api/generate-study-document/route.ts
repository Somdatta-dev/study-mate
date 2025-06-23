import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    try {
      // Use Gemini 2.0 Flash for multimodal document processing
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
You are an expert educator and content simplifier. Transform the following PDF document (which may contain text, images, diagrams, charts, tables, and other visual elements) into a comprehensive, detailed study document that explains everything in simple terms with real-world examples.

CRITICAL REQUIREMENTS:
1. **Analyze ALL Content Types** - Process text, images, diagrams, charts, tables, graphs, formulas, and any visual elements
2. **Start with "What This Document Shows"** - Begin with a clear overview of what the content is about, including what types of visual elements are present
3. **Use Simple Analogies** - Compare complex concepts to everyday things (like "think of this as cooking" or "like organizing your closet")
4. **Break Down Into Clear Sections** - Organize content with numbered sections and descriptive headings
5. **Explain Every Term** - Don't assume the reader knows technical terms. Define everything simply
6. **Describe Visual Elements** - For every image, diagram, chart, or table, provide detailed descriptions and explanations of what they show
7. **Use "Think of it as..." phrases** - Help readers visualize abstract concepts
8. **End with "Why This Matters"** - Explain the practical importance and real-world applications

STRUCTURE TO FOLLOW:
1. **What This Document Shows** - Overview paragraph explaining the main topic, purpose, and types of content (text, images, diagrams, etc.)
2. **Visual Content Summary** - Brief description of key images, diagrams, charts, or tables found in the document
3. **Main Sections** - Break content into 3-5 major sections with clear headings
4. **For each section:**
   - Simple explanation in everyday language
   - Description of any relevant images, diagrams, or charts in that section
   - Real-world analogy or comparison
   - Specific examples that relate to the reader's experience
   - Break down any sub-concepts with bullet points
5. **Key Terms Explained** - Define important vocabulary in simple terms
6. **Visual Elements Explained** - Detailed explanations of what each image, diagram, chart, or table means
7. **Why This Matters** - Practical applications and importance

WRITING STYLE:
- Use "you" to address the reader directly
- Write like you're explaining to a friend who's never heard of this topic
- Use short sentences and paragraphs
- Include phrases like "Think of this as...", "Imagine if...", "This is like..."
- Make connections to everyday experiences
- Explain the "why" behind every concept, not just the "what"
- When describing visual elements, be thorough and clear

EXAMPLE QUALITY LEVEL:
Your explanations should be as detailed and accessible as this example:
"Think of data preprocessing as preparing ingredients for cooking. Just like you wash vegetables, remove bad parts, and cut them into the right sizes before cooking, data preprocessing involves cleaning your raw data (removing errors), filling in missing pieces (like filling gaps in a recipe), and organizing it in a way that makes sense for your computer to understand. The flowchart in the document shows this process as a series of connected boxes, where each box represents a step in cleaning your data - just like following a recipe step by step."

VISUAL CONTENT PROCESSING:
- Carefully examine all images, diagrams, charts, graphs, and tables
- Describe what each visual element shows and why it's important
- Explain how visual elements relate to the text content
- Translate complex visual information into simple explanations
- Use the visual content to enhance understanding of the concepts

Create a detailed, engaging study document that makes this content completely accessible to someone learning it for the first time. Remember: if a concept can't be explained simply, it's not understood well enough - so break everything down to its simplest form, including all visual elements.
`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        }
      ]);

      const studyDocument = result.response.text();

      return NextResponse.json({
        studyDocument,
        originalSize: file.size,
        processedAt: new Date().toISOString(),
        processingMethod: 'multimodal',
        capabilities: ['text', 'images', 'diagrams', 'charts', 'tables']
      });

    } catch (error) {
      console.error('Error generating study document with Gemini:', error);
      return NextResponse.json(
        { error: 'Failed to generate study document. Please check your API key and try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in generate-study-document API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload a PDF.' },
    { status: 405 }
  );
} 