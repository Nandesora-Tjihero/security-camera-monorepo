export default function getDeviceInfo() {
  return {
    isMac: navigator.userAgent.includes('Macintosh'),
  };
}
