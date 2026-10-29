const COLORS = {
  background: 0xf3e8d0,
  player: 0x1d4ed8,
  enemy: 0x6b21a8,
  positive: 0x16a34a,
  negative: 0xea580c,
};

const FONT = 'system-ui, sans-serif';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.drawHeader();
    this.drawRoad();
    this.drawGate(112, 302, '+5', COLORS.positive);
    this.drawGate(278, 302, '−3', COLORS.negative);
    this.drawMonsterGroup();
    this.drawArmy();
    this.drawGuide();
  }

  drawHeader() {
    this.add.text(24, 24, 'STAGE 1', {
      fontFamily: FONT,
      fontSize: '24px',
      color: '#1D4ED8',
    });

    this.add.text(366, 22, '현재 병력', {
      fontFamily: FONT,
      fontSize: '14px',
      color: '#1D4ED8',
    }).setOrigin(1, 0);

    this.add.text(366, 38, '12', {
      fontFamily: FONT,
      fontSize: '48px',
      color: '#1D4ED8',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.add.rectangle(195, 100, 342, 2, COLORS.player);
  }

  drawRoad() {
    const graphics = this.add.graphics();
    graphics.lineStyle(3, COLORS.player, 1);
    graphics.strokeRoundedRect(88, 126, 214, 574, 28);

    graphics.beginPath();
    graphics.moveTo(195, 650);
    graphics.lineTo(195, 390);
    graphics.lineTo(112, 338);
    graphics.moveTo(195, 390);
    graphics.lineTo(278, 338);
    graphics.strokePath();

    graphics.beginPath();
    graphics.moveTo(112, 266);
    graphics.lineTo(195, 216);
    graphics.lineTo(278, 266);
    graphics.strokePath();
  }

  drawGate(x, y, label, color) {
    this.add.rectangle(x, y, 112, 72, color).setStrokeStyle(3, color);
    this.add.text(x, y, label, {
      fontFamily: FONT,
      fontSize: '24px',
      color: '#F3E8D0',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  drawMonsterGroup() {
    this.add.text(195, 155, '최종 몬스터', {
      fontFamily: FONT,
      fontSize: '14px',
      color: '#6B21A8',
    }).setOrigin(0.5);

    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.enemy);
    graphics.fillTriangle(195, 180, 171, 222, 219, 222);
    graphics.fillCircle(195, 181, 17);
  }

  drawArmy() {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.player);

    const positions = [
      [171, 575], [195, 575], [219, 575],
      [183, 610], [207, 610],
    ];

    positions.forEach(([x, y]) => {
      graphics.fillCircle(x, y - 8, 7);
      graphics.fillRoundedRect(x - 6, y, 12, 18, 4);
    });
  }

  drawGuide() {
    this.add.rectangle(195, 748, 342, 2, COLORS.player);
    this.add.text(195, 782, '화면을 누른 채 좌우로 드래그', {
      fontFamily: FONT,
      fontSize: '14px',
      color: '#1D4ED8',
    }).setOrigin(0.5);

    this.add.text(195, 812, '←   부대 이동   →', {
      fontFamily: FONT,
      fontSize: '24px',
      color: '#1D4ED8',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }
}
