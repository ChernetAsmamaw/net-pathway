import { useState } from "react";
import { Upload, ArrowLeft, FileText, Check } from "lucide-react";

interface TranscriptUploadProps {
  onBack: () => void;
}

export default function TranscriptUpload({ onBack }: TranscriptUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    // Implement your file upload logic here
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated upload
    setUploadComplete(true);
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sky-700 hover:text-sky-800 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Assessment Options</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Your Transcript
          </h2>
          <p className="text-gray-600">
            Please upload your academic transcript in PDF format
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="transcript-upload"
          />

          {!file ? (
            <label
              htmlFor="transcript-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-gray-600">
                Drag and drop your transcript here or click to browse
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Supported format: PDF
              </span>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-sky-600" />
                <span className="text-gray-900 font-medium">{file.name}</span>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || uploadComplete}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  uploadComplete
                    ? "bg-green-500"
                    : uploading
                    ? "bg-sky-400"
                    : "bg-sky-600 hover:bg-sky-700"
                } transition-colors`}
              >
                {uploadComplete ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Upload Complete
                  </span>
                ) : uploading ? (
                  "Uploading..."
                ) : (
                  "Upload Transcript"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
