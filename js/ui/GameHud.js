import { COLORS, COLOR_HEX, FONT, GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class GameHud {
  constructor(scene, stageNumber, initialTroops) {
    this.scene = scene;

    scene.add.text(24, 24, `STAGE ${stageNumber}`, {
      fontFamily: FONT,
      fontSize: '24px',
      color: COLOR_HEX.player,
    }).setDepth(50);

    scene.add.text(306, 22, '현재 병력', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
    }).setDepth(50);

    this.troopText = scene.add.text(306, 38, String(initialTroops), {
      fontFamily: FONT,
      fontSize: '48px',
      color: COLOR_HEX.player,
      fontStyle: 'bold',
    }).setDepth(50);

    scene.add.rectangle(195, 100, 342, 2, COLORS.player).setDepth(50);
    this.statusText = scene.add.text(195, 116, '앞으로 자동 전진합니다', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
    }).setOrigin(0.5, 0).setDepth(50);

    scene.add.rectangle(195, 748, 342, 2, COLORS.player).setDepth(50);
    scene.add.text(195, 778, '화면을 누른 채 좌우로 드래그', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
    }).setOrigin(0.5).setDepth(50);
    scene.add.text(195, 812, '←   부대 이동   →', {
      fontFamily: FONT,
      fontSize: '24px',
      color: COLOR_HEX.player,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  setTroops(count) {
    this.troopText.setText(String(count));
  }

  setStatus(message, color = COLOR_HEX.player) {
    this.statusText.setText(message).setColor(color);
  }

  showChange(delta) {
    const positive = delta >= 0;
    const text = this.scene.add.text(195, 170, `${positive ? '+' : ''}${delta}`, {
      fontFamily: FONT,
      fontSize: '48px',
      color: positive ? COLOR_HEX.positive : COLOR_HEX.negative,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(60);

    this.scene.tweens.add({
      targets: text,
      y: 145,
      alpha: 0,
      duration: 700,
      onComplete: () => text.destroy(),
    });
  }

  showResult(success, troops, onRestart) {
    const overlay = this.scene.add.container(0, 0).setDepth(100);
    const panelColor = success ? COLORS.positive : COLORS.negative;

    overlay.add(this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.background, 0.96));
    overlay.add(this.scene.add.rectangle(195, 392, 342, 430, COLORS.background).setStrokeStyle(4, panelColor));
    overlay.add(this.scene.add.text(195, 268, success ? '스테이지 성공!' : '스테이지 실패', {
      fontFamily: FONT,
      fontSize: '24px',
      color: success ? COLOR_HEX.positive : COLOR_HEX.negative,
      fontStyle: 'bold',
    }).setOrigin(0.5));
    overlay.add(this.scene.add.text(195, 328, '남은 병력', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
    }).setOrigin(0.5));
    overlay.add(this.scene.add.text(195, 352, String(troops), {
      fontFamily: FONT,
      fontSize: '48px',
      color: COLOR_HEX.player,
      fontStyle: 'bold',
    }).setOrigin(0.5, 0));
    overlay.add(this.createButton(195, 474, '다시 하기', true, onRestart));

    if (success) {
      overlay.add(this.createButton(195, 550, '다음 스테이지 (준비 중)', false));
    }
  }

  createButton(x, y, label, primary, onClick) {
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.rectangle(0, 0, 286, 56, primary ? COLORS.player : COLORS.background)
      .setStrokeStyle(3, COLORS.player);
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: FONT,
      fontSize: primary ? '24px' : '14px',
      color: primary ? COLOR_HEX.background : COLOR_HEX.player,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([background, text]);
    if (onClick) {
      background.setInteractive({ useHandCursor: true });
      background.on('pointerdown', onClick);
    }
    return container;
  }
}
