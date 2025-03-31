import React, { useRef, useState } from "react";

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCamera = async () => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        const photo = canvasRef.current.toDataURL("image/png");
        setPhotos((prev) => [...prev, photo]);
      }
    }
  };

  const startCountdown = async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(null);
    takePhoto();
  };

  const createPhotoStrip = () => {
    if (photos.length === 3 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 300, 900);
        photos.forEach((photo, index) => {
          const img = new Image();
          img.src = photo;
          img.onload = () => ctx.drawImage(img, 0, index * 300, 300, 300);
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">Cute Photobooth</h1>
      <video ref={videoRef} className="border-4 border-pink-500 rounded-lg" />
      <canvas ref={canvasRef} width={300} height={900} className="hidden" />
      <div className="mt-4">
        {countdown ? (
          <p className="text-2xl text-pink-600">{countdown}</p>
        ) : (
          <button
            onClick={startCountdown}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg"
          >
            Take Photo
          </button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Captured ${index + 1}`}
            className="w-24 h-24 border-2 border-pink-500 rounded-lg"
          />
        ))}
      </div>
      <div className="mt-4">
        {photos.length === 3 && (
          <button
            onClick={createPhotoStrip}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Create Photo Strip
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
