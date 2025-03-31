import { useState } from "react";

interface Props {
  onCameraClick: () => void;
  onUploadClick: () => void;
}

const Landing = ({ onCameraClick, onUploadClick }: Props) => {
  const [activeStrip, setActiveStrip] = useState<"front" | "back">("front");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f4ec] text-brown-800 relative overflow-hidden">
      <div className="flex flex-col gap-10 md:flex-row md:gap-20 items-center justify-center px-6 py-16">
        {/* Photo strip wrapper */}
        <div className="relative w-40 h-80 sm:w-40 sm:h-86 lg:w-64 lg:h-[28rem] mb-16 group cursor-pointer">
          {/* Back Strip */}
          <div
            onClick={() => setActiveStrip("back")}
            className={`absolute inset-0 transition-all duration-500  
            ${
              activeStrip === "back"
                ? "z-20 scale-105"
                : "z-10 opacity-40 scale-[0.95]"
            } 
            rotate-[15deg]  group-hover:rotate-[20deg] group-hover:translate-x-2 group-hover:-translate-y-1`}
          >
            <img
              src="/kumush-dark.png"
              alt="photo strip back"
              className="rounded-md border border-white object-cover shadow-lg"
            />
          </div>

          {/* Front Strip */}
          <div
            onClick={() => setActiveStrip("front")}
            className={`absolute inset-0 transition-all duration-500 
            ${
              activeStrip === "front"
                ? "z-20 scale-105"
                : "z-10 opacity-40 scale-[0.95]"
            } 
            rotate-[-10deg] group-hover:rotate-[-15deg] group-hover:-translate-x-2 group-hover:-translate-y-1`}
          >
            <img
              src="/kumush.png"
              alt="photo strip front"
              className="rounded-md border border-white object-cover shadow-xl"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center md:ml-20 ml-0">
          {/* Title */}
          <h1 className="text-4xl font-cursive font-semibold mb-8 mt-24 text-[#5A2A0C] text-center">
            My Vintage Photobooth
          </h1>

          {/* Buttons */}
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onCameraClick}
              className="bg-[#5A2A0C] text-white px-6 py-3 rounded-md hover:bg-[#4a200a] whitespace-nowrap text-base sm:text-lg"
            >
              Use Camera
            </button>
            <button
              onClick={onUploadClick}
              className="bg-[#5A2A0C] text-white px-6 py-3 rounded-md hover:bg-[#4a200a] whitespace-nowrap text-base sm:text-lg"
            >
              Upload Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
