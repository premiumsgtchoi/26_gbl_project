let sdk = null;

try {
  const { createSDK } = await import('https://h5sdk.onestore.net/lib/v1.2.0/onestore-h5-sdk.min.js');
  sdk = createSDK();
} catch (error) {
  console.warn('ONE store SDK load failed; starting in browser mode.', error);
}

const { startGame } = await import('./main.js');
startGame(sdk);
