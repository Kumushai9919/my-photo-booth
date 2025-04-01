import { useState } from "react";
import Landing from "./components/Landing";
import Upload from "./components/Upload";
import Customization from "./components/Customization";
import PhotoStripPreview from "./components/PhotoStripPreview";
import CameraPage from "./components/CameraPage";

function App() {
  const [step, setStep] = useState<
    "landing" | "upload" | "customize" | "preview" | "camera"
  >("landing");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [customData, setCustomData] = useState<{
    images: string[];
    note: string;
    frameColor: string;
    showDate: boolean;
  } | null>(null);

  return (
    <>
      {step === "landing" && (
        <Landing
          onCameraClick={() => setStep("camera")}
          onUploadClick={() => setStep("upload")}
        />
      )}

      {step === "upload" && (
        <Upload
          onContinue={(images) => {
            setUploadedImages(images);
            setStep("customize");
          }}
        />
      )}

      {step === "camera" && (
        <CameraPage
          onDone={(photos) => {
            setUploadedImages(photos);
            setStep("customize");
          }}
        />
      )}

      {step === "customize" && (
        <Customization
          images={uploadedImages}
          onFinish={(data) => {
            setCustomData(data);
            setStep("preview");
          }}
        />
      )}

      {step === "preview" && customData && (
        <PhotoStripPreview
          images={customData.images}
          note={customData.note}
          frameColor={customData.frameColor}
          showDate={customData.showDate}
        />
      )}
    </>
  );
}

export default App;
