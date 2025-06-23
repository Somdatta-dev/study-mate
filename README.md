# Study Mate - AI-Powered Study Document Generator

Transform your PDFs into simplified study documents using Google Gemini 2.5 Flash AI. Upload any PDF and get a detailed, easy-to-understand study guide in minutes.

## Features

- 🤖 **AI-Powered**: Uses Google Gemini 2.5 Flash for intelligent content analysis and simplification
- 📄 **PDF Processing**: Upload and extract text from PDF documents
- 📚 **Simple Language**: Converts complex academic content into easy-to-understand study materials
- ⬇️ **Download Ready**: Export your study documents as PDF for offline studying and sharing
- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js 15 and Tailwind CSS
- ⚡ **Fast Processing**: Quick PDF analysis and study document generation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **AI**: Google Gemini 2.5 Flash API
- **PDF Processing**: pdf-parse, jsPDF
- **Icons**: Lucide React
- **Deployment Ready**: Vercel, Netlify, or any Node.js hosting platform

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key (get it from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
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

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Upload PDF**: Click the upload area and select a PDF file (up to 10MB)
2. **Generate Study Document**: Click "Generate Study Document" to process the PDF with AI
3. **Review**: The generated study document will appear on the right side
4. **Download**: Click "Download PDF" to save the study document as a PDF file

## API Endpoints

### POST /api/generate-study-document
- Processes uploaded PDF and generates study document using Gemini 2.5 Flash
- Accepts: FormData with PDF file
- Returns: JSON with generated study document

### POST /api/download-pdf
- Converts study document text to downloadable PDF
- Accepts: JSON with content string
- Returns: PDF file as blob

## Project Structure

```
study-mate/
├── src/
│   └── app/
│       ├── api/
│       │   ├── generate-study-document/
│       │   │   └── route.ts
│       │   └── download-pdf/
│       │       └── route.ts
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Configuration

### Tailwind CSS
The project uses Tailwind CSS 4.1 for styling. Configuration is in `tailwind.config.ts`.

### TypeScript
Full TypeScript support with strict mode enabled. Configuration is in `tsconfig.json`.

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` directory
3. Add environment variables in Netlify dashboard

### Other Platforms
The application is compatible with any Node.js hosting platform that supports Next.js.

## Troubleshooting

### Common Issues

1. **"Failed to generate study document"**
   - Check if your Gemini API key is correctly set in `.env.local`
   - Ensure the API key has proper permissions
   - Verify your internet connection

2. **"No text content found in PDF"**
   - Make sure the PDF contains extractable text (not just images)
   - Try with a different PDF file

3. **Upload fails**
   - Check file size (must be under 10MB)
   - Ensure file is a valid PDF format

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Google Gemini 2.5 Flash for AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling
- The open-source community for the various libraries used
