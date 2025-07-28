import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscripton] = useState("");
  const [error, setError] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0] as File;

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Replace with your actual endpoint URL
      const response = await fetch(
        "http://localhost:5000/api/files/audio_to_text",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTranscripton(result.successful);
        setUploadStatus("success");
      } else {
        throw Error("Error transcribing file");
      }
    } catch (error) {
      console.log(error);
      setError((error as Error).message);
      setUploadStatus("Error transcribing file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="p-10 flex flex-col justify-center items-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="w-1/2">
        <h1 className="text-3xl font-bold">Audio Transcription</h1>
        <p className="text-gray-600">
          Upload an audio file to get it transcribed
        </p>
      </div>

      <div className="border border-dashed border-black mt-7 py-7 bg-gray-100 flex flex-col justify-center items-center w-1/2">
        <p className="text-xl font-bold">
          {selectedFile ? selectedFile.name : "Drop your audio file here"}
        </p>
        <p>{selectedFile ? selectedFile.size : "or click to browse"}</p>
        <label className="cursor-pointer">
          <input type="file" onChange={handleFileSelect} className="hidden" />
          <span className="inline-flex items-center border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white mt-5 px-4 py-2">
            {selectedFile ? "Change file" : "Select Audio File"}
          </span>
        </label>
      </div>

      {error && (
        <div className="mt-4 flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload & Transcribe
              </>
            )}
          </button>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Transcription completed successfully!</span>
        </div>
      )}

      {transcription && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Transcription Result
          </h2>
          <div className="bg-white rounded-md border p-4 min-h-[200px]">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {transcription}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigator.clipboard.writeText(transcription)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
