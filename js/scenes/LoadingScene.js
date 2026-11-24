import { preloadAudio } from '../audio.js';
import { COLORS, COLOR_HEX, FONT, GAME_HEIGHT, GAME_WIDTH } from '../config.js';
import { SOLDIER_TEXTURE_KEY } from '../entities/ArmyView.js';

export class LoadingScene extends Phaser.Scene {
  constructor(sdk) {
    super('LoadingScene');
    this.sdk = sdk;
  }

  preload() {
    this.sdk?.setLoadingProgress(0);
    this.load.on('progress', (progress) => {
      this.sdk?.setLoadingProgress(Math.round(progress * 100));
    });

    preloadAudio(this);
    this.load.image(SOLDIER_TEXTURE_KEY, 'assets/images/soldier.png');
  }

  async create() {
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '로딩 중', {
      fontFamily: FONT,
      fontSize: '24px',
      color: COLOR_HEX.player,
    }).setOrigin(0.5);

    if (this.sdk) {
      this.sdk.setLoadingProgress(100);
      try {
        await this.sdk.startGameAsync();
      } catch (error) {
        console.error('ONE store startGameAsync failed.', error);
      }
    }

    this.scene.start('StartScene');
  }
}
