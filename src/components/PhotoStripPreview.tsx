import { useEffect, useRef, useState } from "react";
import { generateFinalPhotoStrip } from "../utils/generateFinalPhotoStrip";

type PhotoStripPreviewProps = {
  images: string[];
  note: string;
  frameColor: string;
  showDate: boolean;
};

function PhotoStripPreview({
  images,
  note,
  frameColor,
  showDate,
}: PhotoStripPreviewProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!stripRef.current) return;
    setIsDownloading(true);
    const dataUrl = await generateFinalPhotoStrip({
      images,
      note,
      frameColor,
      showDate,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "my-photostrip.png";
    link.click();

    setIsDownloading(false);
  };

  // Animation on mount
  useEffect(() => {
    if (!stripRef.current) return;
    stripRef.current.classList.add("animate-drop");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f4ec] py-10">
      <h2 className="font-cursive text-3xl mb-6">Here’s your strip!</h2>

      <div
        ref={stripRef}
        className="w-[240px]   overflow-hidden shadow-xl flex flex-col items-center p-4 transition-all duration-1000"
        //here frame as background color
        style={{ backgroundColor: frameColor }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="w-[200px] h-[200px] overflow-hidden"
            style={{ border: `solid ${frameColor} ` }}
          >
            <img
              src={img}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover mt-2"
            />
          </div>
        ))}
        <p
          className="text-center text-sm text-[#FDF6EC] mt-4 font-cursive"
          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)" }}
        >
          {note}
        </p>

        {showDate && (
          <p
            className="text-[14px] font-cursive text-[#FDF6EC] mt-3"
            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)" }}
          >
            {new Date().toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="mt-8 px-6 py-3 rounded bg-[#5A2A0C] text-white hover:bg-[#47220a]"
      >
        {isDownloading ? "Preparing..." : "Download Strip 📥"}
      </button>
    </div>
  );
}

export default PhotoStripPreview;
