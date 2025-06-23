# Study Mate - AI-Powered Multimodal Study Document Generator

Transform your PDFs (including images, diagrams, and charts) into simplified study documents using Google Gemini 2.5 Flash multimodal AI. Upload any PDF and get a detailed, easy-to-understand study guide that explains all visual content in minutes.

## 🚀 New Features - Multimodal PDF Processing

Study Mate now supports **complete PDF analysis** including:
- **📝 Text Content**: Extracts and simplifies all textual information
- **🖼️ Images & Photos**: Analyzes and describes all images with context
- **📊 Charts & Graphs**: Interprets data visualizations and explains insights  
- **🔄 Diagrams & Flowcharts**: Breaks down complex visual processes step-by-step
- **📋 Tables**: Processes tabular data and explains relationships
- **🧮 Mathematical Formulas**: Explains equations and mathematical concepts
- **🎨 Visual Layouts**: Understands document structure and visual organization

## ✨ Key Features

- 🤖 **Multimodal AI**: Uses Google Gemini 2.5 Flash for intelligent analysis of text, images, diagrams, and charts
- 📄 **Complete PDF Processing**: No content left behind - processes all visual and textual elements
- 🖼️ **Visual Content Processing**: Analyzes and explains images, diagrams, charts, and tables alongside text content
- 📚 **Simple Language**: Converts complex academic content into easy-to-understand study materials
- ⬇️ **Download Ready**: Export your study documents as PDF for offline studying and sharing
- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js 15 and Tailwind CSS
- ⚡ **Fast Processing**: Advanced multimodal AI processing for comprehensive document analysis

## 🔄 What's Changed

### Previous Version (Text-Only)
- ❌ Only extracted plain text from PDFs
- ❌ Missed important visual information
- ❌ Couldn't process diagrams, charts, or images
- ❌ Limited understanding of document structure

### Current Version (Multimodal)
- ✅ **Complete document processing** with text, images, and diagrams
- ✅ **Visual content analysis** - describes and explains all images, charts, and diagrams
- ✅ **Contextual understanding** - relates visual elements to text content
- ✅ **Enhanced study guides** with comprehensive explanations of all content types
- ✅ **Better document structure** understanding

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **AI**: Google Gemini 2.5 Flash (Multimodal)
- **PDF Processing**: Native multimodal processing via Gemini API
- **PDF Generation**: jsPDF for study document export
- **Icons**: Lucide React
- **Deployment Ready**: Vercel, Netlify, or any Node.js hosting platform

## 📋 Prerequisites

- Node.js 18+ installed
- Google Gemini API key with multimodal capabilities (get it from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key))

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/study-mate.git
cd study-mate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get your Gemini API Key:**
1. Go to [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Click "Create API Key"
3. Copy the generated API key
4. Paste it in your `.env.local` file

**Note**: Ensure your API key has access to Gemini 2.5 Flash for multimodal capabilities.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

1. **Upload PDF**: Click the upload area and select a PDF file (up to 10MB)
   - Supports PDFs with any combination of text, images, diagrams, charts, and tables
2. **Generate Study Document**: Click "Generate Study Document" to process the PDF with multimodal AI
   - The AI will analyze ALL content types in your PDF
3. **Review**: The generated study document will appear with detailed explanations of:
   - All text content simplified into easy language
   - Descriptions and explanations of every image and diagram
   - Analysis of charts, graphs, and data visualizations
   - Breakdown of tables and their relationships
4. **Download**: Click "Download PDF" to save the comprehensive study document as a PDF file

## 🔌 API Endpoints

### POST /api/generate-study-document
- Processes uploaded PDF using Gemini 2.5 Flash multimodal capabilities
- **Input**: FormData with PDF file (supports text, images, diagrams, charts)
- **Output**: JSON with comprehensive study document including visual content analysis
- **Processing Method**: Direct PDF to Gemini API (no intermediate text extraction)
- **Capabilities**: ['text', 'images', 'diagrams', 'charts', 'tables']

### POST /api/download-pdf
- Converts study document text to downloadable PDF
- **Input**: JSON with content string
- **Output**: PDF file as blob

## 📁 Project Structure

```
study-mate/
├── src/
│   └── app/
│       ├── api/
│       │   ├── generate-study-document/
│       │   │   └── route.ts          # Multimodal PDF processing
│       │   └── download-pdf/
│       │       └── route.ts          # PDF generation
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx                  # Updated UI with multimodal features
├── public/
├── .env.local
├── package.json                      # Updated dependencies
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## ⚙️ Configuration

### Gemini 2.5 Flash Model
The application uses `gemini-2.5-flash` for:
- Multimodal document processing
- Advanced visual content analysis
- Enhanced contextual understanding
- Comprehensive study document generation

### Tailwind CSS
The project uses Tailwind CSS 3.4 for styling. Configuration is in `tailwind.config.ts`.

### TypeScript
Full TypeScript support with strict mode enabled. Configuration is in `tsconfig.json`.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy

### Environment Variables Required
- `GEMINI_API_KEY`: Your Google Gemini API key with multimodal access (required)

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to generate study document"**
   - Check if your Gemini API key is correctly set in `.env.local`
   - Ensure the API key has access to Gemini 2.5 Flash multimodal capabilities
   - Verify your internet connection

2. **Visual content not being processed**
   - Ensure you're using Gemini 2.5 Flash (not older versions)
   - Check that your PDF contains actual visual elements
   - Verify API key permissions

3. **Upload fails**
   - Check file size (must be under 10MB)
   - Ensure file is a valid PDF format
   - PDFs with password protection are not supported

### Performance Tips

- **Optimal file size**: 1-5MB PDFs process fastest
- **Content types**: Works best with academic papers, textbooks, research documents
- **Visual quality**: Higher resolution images in PDFs provide better analysis

## 🎯 Use Cases

Perfect for:
- **📚 Academic Research**: Papers with complex diagrams and charts
- **📖 Textbook Study**: Books with illustrations and visual aids  
- **📊 Technical Documents**: Reports with data visualizations
- **🔬 Scientific Papers**: Documents with experimental diagrams
- **📈 Business Reports**: Presentations with charts and infographics
- **🏗️ Engineering Docs**: Technical drawings and schematics

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Enhanced visual processing algorithms
- Support for additional document formats
- Advanced study guide templates
- Mobile app development

Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini 2.5 Flash for multimodal AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling
- The open-source community for various libraries used

## 📈 Version History

- **v0.2.0** (Current): Multimodal PDF processing with complete visual content analysis
- **v0.1.0**: Text-only PDF processing (deprecated)

---

**🎉 Upgrade Notice**: If you're upgrading from the text-only version, your existing study documents will still work, but new documents will include comprehensive visual content analysis!
