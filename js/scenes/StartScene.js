import { preloadAudio, startBgmAfterInteraction } from '../audio.js';
import { COLORS, COLOR_HEX, FONT, GAME_WIDTH } from '../config.js';
import { STAGES } from '../stageData.js';
import { createButton, createSoundToggleButton } from '../ui/uiFactory.js';
import { getRequestedStageIndex } from '../utils/stageSelection.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload() {
    preloadAudio(this);
  }

  create() {
    const requestedStageIndex = getRequestedStageIndex(window.location.search, STAGES.length);
    if (requestedStageIndex !== null) {
      this.scene.start('GameScene', { stageIndex: requestedStageIndex });
      return;
    }

    startBgmAfterInteraction(this);
    this.cameras.main.setBackgroundColor(COLORS.background);
    createSoundToggleButton(this);
    this.add.text(GAME_WIDTH / 2, 112, '연산 게이트 러너', {
      fontFamily: FONT,
      fontSize: '24px',
      color: COLOR_HEX.player,
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 152, '왕국의 세 길목을 되찾으세요', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
      align: 'center',
    }).setOrigin(0.5);

    this.drawSoldier(112, 334, 0.9);
    this.drawSoldier(GAME_WIDTH / 2, 306, 1.35);
    this.drawSoldier(278, 334, 0.9);

    this.add.text(GAME_WIDTH / 2, 462, '게이트를 골라 병력을 늘리고\n몬스터를 물리치세요', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5);

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: 588,
      label: '시작하기',
      onClick: () => this.scene.start('GameScene', { stageIndex: 0 }),
    });

    this.add.text(GAME_WIDTH / 2, 658, '누른 채 좌우로 드래그해 부대를 이동합니다', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
    }).setOrigin(0.5);

  }

  drawSoldier(x, y, scale) {
    const soldier = this.add.graphics({ x, y });
    soldier.setScale(scale);

    soldier.fillStyle(COLORS.player);
    soldier.fillRoundedRect(-24, 18, 48, 60, 18);
    soldier.fillCircle(0, -4, 24);
    soldier.fillRect(-26, -5, 52, 10);
    soldier.lineStyle(10, COLORS.player, 1);
    soldier.beginPath();
    soldier.moveTo(-13, 72);
    soldier.lineTo(-17, 96);
    soldier.moveTo(13, 72);
    soldier.lineTo(17, 96);
    soldier.strokePath();

    soldier.fillStyle(COLORS.background);
    soldier.fillRoundedRect(-15, -7, 30, 14, 6);
    soldier.fillCircle(27, 48, 21);
    soldier.lineStyle(5, COLORS.player, 1);
    soldier.strokeCircle(27, 48, 21);
    soldier.beginPath();
    soldier.moveTo(27, 36);
    soldier.lineTo(27, 60);
    soldier.moveTo(15, 48);
    soldier.lineTo(39, 48);
    soldier.strokePath();
  }
}
