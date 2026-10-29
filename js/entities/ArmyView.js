import { COLORS, FONT, COLOR_HEX } from '../config.js';

export class ArmyView {
  constructor(scene, x, y) {
    this.container = scene.add.container(x, y).setDepth(20);
    this.graphics = scene.add.graphics();
    this.extraText = scene.add.text(0, 44, '', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.player,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.container.add([this.graphics, this.extraText]);
  }

  setX(x) {
    this.container.x = x;
  }

  setCount(count) {
    this.graphics.clear();
    this.graphics.fillStyle(COLORS.player);

    const shown = Math.min(count, 10);
    for (let index = 0; index < shown; index += 1) {
      const column = index % 5;
      const row = Math.floor(index / 5);
      const x = (column - 2) * 18;
      const y = row * 28 - 18;
      this.graphics.fillCircle(x, y - 6, 5);
      this.graphics.fillRoundedRect(x - 5, y, 10, 14, 3);
    }

    this.extraText.setText(count > shown ? `+${count - shown}` : '');
  }
}
