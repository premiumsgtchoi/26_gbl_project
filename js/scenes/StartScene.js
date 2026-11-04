import { COLORS, COLOR_HEX, FONT, GAME_WIDTH } from '../config.js';
import { STAGES } from '../stageData.js';
import { getRequestedStageIndex } from '../utils/stageSelection.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    const requestedStageIndex = getRequestedStageIndex(window.location.search, STAGES.length);
    if (requestedStageIndex !== null) {
      this.scene.start('GameScene', { stageIndex: requestedStageIndex });
      return;
    }

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.text(GAME_WIDTH / 2, 230, '연산 게이트\n러너', {
      fontFamily: FONT,
      fontSize: '48px',
      color: COLOR_HEX.player,
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 360, '게이트를 골라 병력을 늘리고\n몬스터를 물리치세요', {
      fontFamily: FONT,
      fontSize: '24px',
      color: COLOR_HEX.player,
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5);

    const startButton = this.add.graphics()
      .fillStyle(COLORS.player)
      .fillRoundedRect(52, 482, 286, 56, 12)
      .setInteractive(
        new Phaser.Geom.Rectangle(52, 482, 286, 56),
        Phaser.Geom.Rectangle.Contains,
      );
    startButton.input.cursor = 'pointer';
    this.add.text(GAME_WIDTH / 2, 510, '시작하기', {
      fontFamily: FONT,
      fontSize: '24px',
      color: COLOR_HEX.background,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 574, '화면을 누른 채 좌우로 드래그해 이동합니다', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
    }).setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene', { stageIndex: 0 });
    });
  }
}
