import { useEffect, useRef, useState } from "react";

type CameraPageProps = {
  onDone: (photos: string[]) => void;
};

function CameraPage({ onDone }: CameraPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => {
            console.warn("Video play interrupted:", e);
          });
        };
      }
    });

    return () => {
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (photos.length < 3) {
      startPhotoSequence();
    } else {
      onDone(photos);
    }
  }, [photos]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw the video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply Black & White Filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg =
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) /
          3;
        imageData.data[i] = avg; // Red
        imageData.data[i + 1] = avg; // Green
        imageData.data[i + 2] = avg; // Blue
      }
      ctx.putImageData(imageData, 0, 0);

      // Save the black-and-white image
      const dataUrl = canvas.toDataURL("image/png");
      setPhotos((prev) => [...prev, dataUrl]);
    }

    // Simulate flash
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };

  const startPhotoSequence = () => {
    setIsPreparing(true);
    setCountdown(null);
 
    setTimeout(() => {
      setIsPreparing(false);
      let count = 3;
      setCountdown(count);
 
      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
        } else {
          clearInterval(interval);
          setCountdown(null);
          takePhoto();
        }
      }, 1000);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <video
        ref={videoRef} 
        className="w-72 h-72 rounded-lg shadow-lg object-cover filter grayscale"
        autoPlay
        muted
      />

      {/* Overlay UI */}
      {(isPreparing || countdown !== null) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          {countdown !== null ? (
            <span className="text-white font-cursive text-[80px] drop-shadow-md">
              {countdown}
            </span>
          ) : (
            <p className="text-white text-lg mt-4 font-medium">
              Prepare for next photo...
            </p>
          )}
        </div>
      )}

      {/* Flash Effect */}
      {flash && (
        <div className="absolute inset-0 bg-white opacity-80 z-50 animate-fade-out" />
      )}

      <p className="mt-6 text-white text-sm">
        Taking photo {photos.length + 1} / 3
      </p>
    </div>
  );
}

export default CameraPage;
