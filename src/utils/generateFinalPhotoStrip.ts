export async function generateFinalPhotoStrip({
  images,
  note,
  frameColor,
  showDate,
  style = "default",
}: {
  images: string[];
  note: string;
  frameColor: string;
  showDate: boolean;
  style?: "default" | "bw";
}): Promise<string> {
  const width = 600;
  const photoSize = 500;
  const margin = 20; // 👈 smaller margin like real photobooths
  const topMargin = 32;
  const noteHeight = 80;
  const dateHeight = showDate ? 40 : 0;

  const height =
    photoSize * images.length +
    margin * (images.length - 1) + // between photos
    topMargin +
    noteHeight +
    dateHeight; 

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, width, height);

  const drawRoundedRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  };

  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[i];

    await new Promise((res) => {
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetRatio = 1;

        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;

        if (aspectRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        const x = (width - photoSize) / 2;
        const y = topMargin + i * (photoSize + margin);

        // Draw frame
        ctx.fillStyle = frameColor;
        drawRoundedRect(x - 10, y - 10, photoSize + 20, photoSize + 20, 20);

        // Draw photo
        ctx.drawImage(img, sx, sy, sw, sh, x, y, photoSize, photoSize);

        // Apply B&W filter
        if (style === "bw") {
          const imageData = ctx.getImageData(x, y, photoSize, photoSize);
          for (let p = 0; p < imageData.data.length; p += 4) {
            const avg =
              (imageData.data[p] +
                imageData.data[p + 1] +
                imageData.data[p + 2]) /
              3;
            imageData.data[p] = avg;
            imageData.data[p + 1] = avg;
            imageData.data[p + 2] = avg;
          }
          ctx.putImageData(imageData, x, y);
        }

        res(true);
      };
    });
  }

  const bottomMargin = 30;
  const shadowColor = "rgba(0, 0, 0, 0.4)";
  const textColor = "#FDF6EC";
  const noteFontSize = 28;
  const dateFontSize = 20;
  const spaceBetween = 12;

  // Draw note
  ctx.font = `${noteFontSize}px Pacifico, cursive`;
  ctx.textAlign = "center";

  // Shadow first
  ctx.fillStyle = shadowColor;
  ctx.fillText(
    note,
    width / 2 + 1,
    height - bottomMargin - dateFontSize - spaceBetween + 1
  );
  ctx.fillStyle = textColor;
  ctx.fillText(
    note,
    width / 2,
    height - bottomMargin - dateFontSize - spaceBetween
  );

  // Draw date below note
  if (showDate) {
    const date = new Date().toLocaleDateString();
    ctx.font = `${dateFontSize}px Pacifico, cursive`;

    ctx.fillStyle = shadowColor;
    ctx.fillText(date, width / 2 + 1, height - bottomMargin + 1);
    ctx.fillStyle = textColor;
    ctx.fillText(date, width / 2, height - bottomMargin);
  }

  return canvas.toDataURL("image/jpeg", 1.0);
}
