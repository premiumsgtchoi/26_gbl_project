import { COLORS, FONT, COLOR_HEX } from '../config.js';

const MAX_VISIBLE_TROOPS = 10;
const TROOPS_PER_ROW = 5;

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

    const shown = Math.min(count, MAX_VISIBLE_TROOPS);
    for (let index = 0; index < shown; index += 1) {
      const column = index % TROOPS_PER_ROW;
      const row = Math.floor(index / TROOPS_PER_ROW);
      const x = (column - 2) * 18;
      const y = row * 28 - 18;
      this.graphics.fillRoundedRect(x - 5, y, 10, 14, 3);
      this.graphics.fillCircle(x, y - 7, 6);
      this.graphics.fillTriangle(x - 6, y - 9, x, y - 15, x + 6, y - 9);
      this.graphics.fillRect(x - 7, y - 9, 14, 3);

      this.graphics.fillStyle(COLORS.background);
      this.graphics.fillCircle(x, y - 6, 3);
      this.graphics.fillCircle(x + 7, y + 6, 6);

      this.graphics.fillStyle(COLORS.player);
      this.graphics.fillCircle(x + 7, y + 6, 5);
    }

    this.extraText.setText(count > shown ? `+${count - shown}` : '');
  }
}
