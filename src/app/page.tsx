'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, FileText, Download, BookOpen, Loader2 } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [studyDocument, setStudyDocument] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStudyDocument('');
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const generateStudyDocument = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/generate-study-document', {
        method: 'POST',
        body: formData,
      });

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate study document');
      }

      const data = await response.json();
      setStudyDocument(data.studyDocument);
    } catch (error) {
      console.error('Error generating study document:', error);
      alert('Failed to generate study document. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const downloadPDF = async () => {
    if (!studyDocument) {
      alert('No study document to download');
      return;
    }

    if (downloadingPDF) {
      return; // Prevent multiple downloads
    }

    setDownloadingPDF(true);

    try {
      console.log('Starting PDF download...');
      console.log('Study document length:', studyDocument.length);
      
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: studyDocument }),
      }).catch(fetchError => {
        console.error('Fetch error:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      });

      console.log('Response received:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch {
          errorText = 'Unable to read error response';
        }
        console.error('PDF generation failed:', errorText);
        throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
      }

      // Get the response as blob
      let blob;
      try {
        blob = await response.blob();
        console.log('Blob created successfully:', {
          size: blob.size,
          type: blob.type,
          constructor: blob.constructor.name
        });
      } catch (blobError) {
        console.error('Error creating blob:', blobError);
        const errorMessage = blobError instanceof Error ? blobError.message : 'Unknown blob error';
        throw new Error(`Failed to process PDF response: ${errorMessage}`);
      }
      
      // Verify blob size
      if (blob.size === 0) {
        throw new Error('Empty PDF file generated');
      }

      // Create download using modern approach with better error handling
      try {
        console.log('Creating object URL...');
        const url = URL.createObjectURL(blob);
        console.log('Object URL created:', url);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-document-${new Date().toISOString().split('T')[0]}.pdf`;
        a.style.display = 'none';
        
        console.log('Adding link to DOM and triggering click...');
        document.body.appendChild(a);
        a.click();
        
        // Small delay before cleanup
        setTimeout(() => {
          try {
            if (document.body.contains(a)) {
              document.body.removeChild(a);
            }
            URL.revokeObjectURL(url);
            console.log('Cleanup completed');
          } catch (cleanupError) {
            console.warn('Cleanup error (non-critical):', cleanupError);
          }
        }, 100);
        
        console.log('PDF download initiated successfully');
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
        
      } catch (downloadError) {
        console.error('Error during download process:', downloadError);
        const errorMessage = downloadError instanceof Error ? downloadError.message : 'Unknown download error';
        throw new Error(`Failed to initiate download: ${errorMessage}`);
      }
      
    } catch (error) {
      console.error('Complete error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to download PDF: ${errorMessage}`);
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          PDF downloaded successfully!
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-indigo-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Study Mate</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your PDFs (including images, diagrams, and charts) into simplified study documents using AI. 
            Upload any PDF and get a detailed, easy-to-understand study guide that explains all visual content in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <Upload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Upload Your PDF</h2>
              <p className="text-gray-400">Select or drag & drop a PDF file to generate your study document</p>
            </div>

            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragOver 
                  ? 'border-indigo-400 bg-indigo-400/10' 
                  : 'border-gray-600 hover:border-indigo-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <FileText className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-indigo-400' : 'text-gray-500'}`} />
              <span className="text-lg text-gray-300 font-medium block mb-2">
                {isDragOver ? 'Drop your PDF here' : 'Click to upload or drag & drop PDF'}
              </span>
              <span className="text-sm text-gray-500">
                Supports PDF files up to 10MB
              </span>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-indigo-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loading && uploadProgress > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={generateStudyDocument}
              disabled={!file || loading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating Study Document...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Generate Study Document
                </>
              )}
            </button>
          </div>

          {/* Study Document Display */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Study Document</h2>
              {studyDocument && (
                <button
                  onClick={downloadPDF}
                  disabled={downloadingPDF}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  {downloadingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="min-h-[400px] border border-gray-600 rounded-xl p-6 bg-gray-900">
              {studyDocument ? (
                <div className="prose prose-invert max-w-none">
                  <div
                    className="whitespace-pre-wrap text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: studyDocument.replace(/\n/g, '<br>')
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="text-lg">Your study document will appear here</p>
                  <p className="text-sm mt-2">Upload a PDF and click generate to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Your Personal Study Mate
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-700">
                <BookOpen className="w-8 h-8 text-indigo-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Multimodal AI</h4>
              <p className="text-gray-400">
                Uses Google Gemini 2.0 Flash for intelligent analysis of text, images, diagrams, and charts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700">
                <FileText className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Visual Content Processing</h4>
              <p className="text-gray-400">
                Analyzes and explains images, diagrams, charts, and tables alongside text content
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                <Download className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Download Ready</h4>
              <p className="text-gray-400">
                Export your study documents as PDF for offline studying and sharing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
