export default defineNitroPlugin(async (nitroApp) => {
  await import('@tensorflow/tfjs-node');
});
