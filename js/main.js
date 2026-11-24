import { setRingerSilent } from './audio.js';
import { GameScene } from './scenes/GameScene.js';
import { LoadingScene } from './scenes/LoadingScene.js';
import { StartScene } from './scenes/StartScene.js';
import { COLOR_HEX, GAME_HEIGHT, GAME_WIDTH } from './config.js';

export async function startGame(sdk) {
  let game;
  let appPaused = false;
  let initialRingerSilent;

  function pauseGame() {
    if (!game || !appPaused) return;
    game.pause();
    game.sound.pauseAll();
  }

  if (sdk) {
    sdk.on('pause', () => {
      if (appPaused) return;
      appPaused = true;
      pauseGame();
    });
    sdk.on('resume', (event) => {
      if (typeof event.ringerSilent === 'boolean') {
        initialRingerSilent = event.ringerSilent;
        if (game) setRingerSilent(game.sound, initialRingerSilent);
      }
      if (!appPaused) return;
      appPaused = false;
      if (!game) return;
      game.resume();
      game.sound.resumeAll();
    });
    sdk.on('exit', () => {
      // Progress is intentionally kept only for the current play session.
    });
    sdk.onBackPressed(() => false);

    try {
      const info = await sdk.initializeAsync();
      if (info.err) {
        sdk = null;
      } else if (typeof initialRingerSilent !== 'boolean') {
        initialRingerSilent = info.ringerSilent;
      }
    } catch (error) {
      console.error('ONE store initializeAsync failed.', error);
      sdk = null;
    }
  }

  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLOR_HEX.background,
    scene: [new LoadingScene(sdk), StartScene, GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  game = new Phaser.Game(config);
  window.game = game;
  game.events.once(Phaser.Core.Events.READY, () => {
    if (typeof initialRingerSilent === 'boolean') {
      setRingerSilent(game.sound, initialRingerSilent);
    }
    pauseGame();
  });
}
