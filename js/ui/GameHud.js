import { COLORS, COLOR_HEX, FONT, TIME } from '../config.js';
import { createButton, createPopup, createSoundToggleButton } from './uiFactory.js';

export class GameHud {
  constructor(scene, stageNumber, initialTroops) {
    this.scene = scene;
    createSoundToggleButton(scene);

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
      duration: TIME.changeFeedback,
      onComplete: () => text.destroy(),
    });
  }

  showResult(success, troops, onRestart, onNext, onStartOver) {
    const panelColor = success ? COLORS.positive : COLORS.negative;
    const resultTitle = onStartOver
      ? '모든 스테이지 클리어'
      : success ? '스테이지 성공!' : '스테이지 실패';
    const overlay = createPopup(this.scene, {
      x: 195,
      y: 392,
      width: 342,
      height: 430,
      borderColor: panelColor,
    }).setDepth(100);

    overlay.add(this.scene.add.text(195, 268, resultTitle, {
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
    if (onStartOver) {
      overlay.add(createButton(this.scene, {
        x: 195,
        y: 474,
        label: '처음부터',
        onClick: onStartOver,
      }));
    } else {
      overlay.add(createButton(this.scene, {
        x: 195,
        y: 474,
        label: '다시 하기',
        onClick: onRestart,
      }));
      if (success) {
        overlay.add(createButton(this.scene, {
          x: 195,
          y: 550,
          label: '다음 스테이지',
          primary: false,
          onClick: onNext,
        }));
      }
    }
  }
}
