import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";
import GeneratePhotoStrip from "../utils/generatePhotoStrip";

type CropModalProps = {
  file: File;
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
};

function CropModal({ file, onCropComplete, onClose }: CropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const handleCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImage = await GeneratePhotoStrip(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-[300px] h-[400px] bg-black rounded-lg shadow-lg overflow-hidden">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-64"
        />
        <button
          onClick={handleApply}
          className="bg-[#5A2A0C] text-white px-6 py-2 rounded hover:bg-[#47220a]"
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}

export default CropModal;
