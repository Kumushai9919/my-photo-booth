import React, { useState, ChangeEvent } from "react";
import CropModal from "./CropModal";
import heic2any from "heic2any";

type UploadProps = {
  onContinue: (photos: string[]) => void;
};

function Upload({ onContinue }: UploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [showCrop, setShowCrop] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
      try {
        const blob = await heic2any({ blob: file, toType: "image/jpeg" });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const convertedFile = base64ToFile(base64data, file.name);
          setSelectedFile(convertedFile);
          setShowCrop(true);
        };
        reader.readAsDataURL(blob as Blob);
      } catch (err) {
        console.error("HEIC conversion error:", err);
        alert("Failed to convert HEIC. Please upload JPG or PNG instead.");
      }
    } else {
      setSelectedFile(file);
      setShowCrop(true);
    }
  };

  const base64ToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename.replace(/\.heic$/, ".jpeg"), { type: mime });
  };

  const handleCropComplete = (croppedImage: string) => {
    setImages((prev) => [...prev, croppedImage]);
    setShowCrop(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f4ec] text-brown-800 flex flex-col items-center pt-12">
      <h2 className="font-cursive text-2xl mb-4">Upload Your Photos</h2>

      <div className="flex gap-4">
        {[0, 1, 2].map((idx) => (
          <label
            key={idx}
            className="w-28 h-28 border rounded cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {images[idx] ? (
              <img
                src={images[idx]}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-full object-cover "
              />
            ) : (
              <span className="text-lg text-gray-500">{idx + 1}</span>
            )}
            <input
              type="file"
              accept="image/heic,image/heif,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ))}
      </div>

      <button
        disabled={images.length < 3}
        onClick={() => onContinue(images)}
        className={`mt-6 px-6 py-2 rounded ${
          images.length < 3 ? "bg-gray-400" : "bg-[#5A2A0C] text-white"
        }`}
      >
        Continue with {images.length} photos
      </button>

      {showCrop && selectedFile && (
        <CropModal
          file={selectedFile}
          onClose={() => setShowCrop(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default Upload;
 