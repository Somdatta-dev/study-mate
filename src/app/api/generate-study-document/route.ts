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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // Use pdf2json as an alternative since pdf-parse has issues
      const pdf2json = await import('pdf2json');
      const PDFParser = pdf2json.default;
      
      return new Promise<NextResponse>((resolve) => {
        const pdfParser = new PDFParser();
        
        pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
          console.error('PDF parsing error:', errData.parserError.message);
          resolve(NextResponse.json(
            { error: 'Failed to parse PDF content' },
            { status: 500 }
          ));
        });
        
        pdfParser.on("pdfParser_dataReady", async (pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }) => {
          try {
            // Extract text from PDF data
            let extractedText = '';
            if (pdfData.Pages) {
              for (const page of pdfData.Pages) {
                if (page.Texts) {
                  for (const text of page.Texts) {
                    if (text.R) {
                      for (const run of text.R) {
                        if (run.T) {
                          extractedText += decodeURIComponent(run.T) + ' ';
                        }
                      }
                    }
                  }
                }
                extractedText += '\n';
              }
            }
            
            if (!extractedText.trim()) {
              resolve(NextResponse.json(
                { error: 'No text content found in PDF' },
                { status: 400 }
              ));
              return;
            }
            
            // Use Gemini 2.5 Flash to generate study document
            try {
              const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

              const prompt = `
You are an expert educator and content simplifier. Transform the following PDF content into a comprehensive, detailed study document that explains everything in simple terms with real-world examples.

CRITICAL REQUIREMENTS:
1. **Start with "What This Shows"** - Begin with a clear overview of what the content is about
2. **Use Simple Analogies** - Compare complex concepts to everyday things (like "think of this as cooking" or "like organizing your closet")
3. **Break Down Into Clear Sections** - Organize content with numbered sections and descriptive headings
4. **Explain Every Term** - Don't assume the reader knows technical terms. Define everything simply
5. **Provide Real Examples** - For every concept, give concrete, relatable examples
6. **Use "Think of it as..." phrases** - Help readers visualize abstract concepts
7. **End with "Why This Matters"** - Explain the practical importance and real-world applications

STRUCTURE TO FOLLOW:
1. **What This Shows** - Overview paragraph explaining the main topic and purpose
2. **Main Sections** - Break content into 3-5 major sections with clear headings
3. **For each section:**
   - Simple explanation in everyday language
   - Real-world analogy or comparison
   - Specific examples that relate to the reader's experience
   - Break down any sub-concepts with bullet points
4. **Key Terms Explained** - Define important vocabulary in simple terms
5. **Why This Matters** - Practical applications and importance

WRITING STYLE:
- Use "you" to address the reader directly
- Write like you're explaining to a friend who's never heard of this topic
- Use short sentences and paragraphs
- Include phrases like "Think of this as...", "Imagine if...", "This is like..."
- Make connections to everyday experiences
- Explain the "why" behind every concept, not just the "what"

EXAMPLE QUALITY LEVEL:
Your explanations should be as detailed and accessible as this example:
"Think of data preprocessing as preparing ingredients for cooking. Just like you wash vegetables, remove bad parts, and cut them into the right sizes before cooking, data preprocessing involves cleaning your raw data (removing errors), filling in missing pieces (like filling gaps in a recipe), and organizing it in a way that makes sense for your computer to understand."

Here's the PDF content to transform:

${extractedText}

Create a detailed, engaging study document that makes this content completely accessible to someone learning it for the first time. Remember: if a concept can't be explained simply, it's not understood well enough - so break everything down to its simplest form.
`;

              const result = await model.generateContent(prompt);
              const studyDocument = result.response.text();

              resolve(NextResponse.json({
                studyDocument,
                originalLength: extractedText.length,
                processedAt: new Date().toISOString(),
              }));

            } catch (error) {
              console.error('Error generating study document with Gemini:', error);
              resolve(NextResponse.json(
                { error: 'Failed to generate study document. Please check your API key and try again.' },
                { status: 500 }
              ));
            }
          } catch (error) {
            console.error('Error processing PDF data:', error);
            resolve(NextResponse.json(
              { error: 'Failed to process PDF content' },
              { status: 500 }
            ));
          }
        });
        
        pdfParser.parseBuffer(buffer);
      });
      
    } catch (error) {
      console.error('Error parsing PDF:', error);
      return NextResponse.json(
        { error: 'Failed to parse PDF content' },
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