export const captureImageFromVideoAndBoundingBoxValues = async (
  bbox: [number, number, number, number],
  srcVideo: HTMLVideoElement | null
) => {
  const canvas = createCanvasForWidthAndHeight(
    srcVideo?.videoWidth || 0,
    srcVideo?.videoHeight || 0
  );
  let _blob: Blob | undefined;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (!srcVideo) {
      throw new Error('Source video is null');
    }

    ctx.drawImage(srcVideo, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(bbox[0], bbox[1], bbox[2], bbox[3]);

    const bBoxCanvas = createCanvasForWidthAndHeight(bbox[2], bbox[3]);
    const ctx2 = bBoxCanvas.getContext('2d');

    if (ctx2) {
      ctx2.putImageData(imageData, 0, 0);

      const dataURL = bBoxCanvas.toDataURL();

      _blob = createBlobFromDataURL(dataURL);
    } else {
      _blob = undefined;
    }
  }
  return _blob;
};

function createBlobFromDataURL(dataURL: string) {
  const byteString = atob(dataURL.split(',')[1]); // Decode base64 string
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type

  const arrayBufferFromBase64 = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBufferFromBase64);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBufferFromBase64], { type: mimeString });
}

const createCanvasForWidthAndHeight = (width: number, height: number) => {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  return canvas;
};
