export async function bootGame(sdk) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Phaser load failed.'));
    document.body.append(script);
  });

  const { startGame } = await import('./main.js');
  await startGame(sdk);
}
