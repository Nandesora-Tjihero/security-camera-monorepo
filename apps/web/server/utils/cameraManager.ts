const initVideoCapture = async (video: HTMLVideoElement) => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // capture webcam feed, it's a continuous stream
  video.srcObject = stream; // pass the webcam feed to the video element to view it
  // video.addEventListener(
  //   'loadeddata',
  //   await detectPersonInFrame
  // ); // when the video feed is loaded on the video element, start detecting objects
};
export const isCameraSupported =
  'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
    ? true
    : false;
