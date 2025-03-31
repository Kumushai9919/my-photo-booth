import { useState } from "react";

type CustomizationProps = {
  images: string[];
  onFinish: (data: {
    images: string[];
    note: string;
    frameColor: string;
    showDate: boolean;
  }) => void;
};

function Customization({ images, onFinish }: CustomizationProps) {
  const [note, setNote] = useState("");
  const [frameColor, setFrameColor] = useState("#5A2A0C");
  const [showDate, setShowDate] = useState(true);

  const frameOptions = [
    "#7D0A0A", // deep brown (wood)
    "#322C2B", // dark gray
    "#3E2F1C", // dark walnut
    "#826754", // muted mocha
    "#374151", // charcoal gray
    "#a1624e", // vintage reddish brown
    "#E4C59E", // warm beige
  ];

  return (
    <div className="min-h-screen bg-[#fff9f1] px-20 py-6 text-center text-brown-800 flex justify-center">
      <div className="flex flex-col justify-center items-start w-full max-w-screen-sm ">
        <h2 className="font-cursive text-2xl mb-4">
          Add a message to your photos!
        </h2>

        <textarea
          maxLength={150}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Write a note or memory..."
          className="w-full max-w-md p-3 border border-[#5A2A0C] rounded mb-4  font-cursive "
        />

        <div className="mb-6 items-start flex-col flex">
          <p className="mb-1 text-brown-800 font-semibold">Pick Frame Color:</p>
          <div className="flex gap-3 flex-wrap">
            {frameOptions.map((color) => (
              <button
                key={color}
                onClick={() => setFrameColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  frameColor === color ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 mb-8 flex items-center gap-2 ">
          <span className="text-brown-800  font-semibold">
            Display date stamp
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showDate}
              onChange={(e) => setShowDate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#5A2A0C] transition-all"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full" />
          </label>
        </div>

        <button
          onClick={() =>
            onFinish({
              images,
              note,
              frameColor,
              showDate,
            })
          }
          className="bg-[#5A2A0C] text-white px-6 py-2 rounded hover:bg-[#47220a]"
        >
          Create My Photostrip
        </button>
      </div>
    </div>
  );
}

export default Customization;
