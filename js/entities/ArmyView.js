import { COLORS, FONT, COLOR_HEX } from '../config.js';

const MAX_VISIBLE_TROOPS = 10;
const TROOPS_PER_ROW = 5;
const SOLDIER_IMAGE_SIZE = 30;

export const SOLDIER_TEXTURE_KEY = 'soldier';

export class ArmyView {
  constructor(scene, x, y) {
    this.scene = scene;
    this.container = scene.add.container(x, y).setDepth(20);
    this.graphics = scene.add.graphics();
    this.soldierImages = [];
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
    this.soldierImages.forEach((image) => image.destroy());
    this.soldierImages = [];
    this.graphics.fillStyle(COLORS.player);

    const shown = Math.min(count, MAX_VISIBLE_TROOPS);
    const useSoldierImage = this.scene.textures.exists(SOLDIER_TEXTURE_KEY);
    for (let index = 0; index < shown; index += 1) {
      const column = index % TROOPS_PER_ROW;
      const row = Math.floor(index / TROOPS_PER_ROW);
      const x = (column - 2) * 18;
      const y = row * 28 - 18;

      if (useSoldierImage) {
        const image = this.scene.add.image(x + 3, y - 0.5, SOLDIER_TEXTURE_KEY)
          .setDisplaySize(SOLDIER_IMAGE_SIZE, SOLDIER_IMAGE_SIZE);
        this.container.add(image);
        this.soldierImages.push(image);
        continue;
      }

      this.graphics.fillRoundedRect(x - 5, y, 10, 14, 3);
      this.graphics.fillTriangle(x - 6, y - 9, x, y - 15, x + 6, y - 9);
      this.graphics.fillRect(x - 6, y - 9, 12, 9);

      this.graphics.fillStyle(COLORS.background);
      this.graphics.fillRoundedRect(x - 4, y - 8, 8, 4, 2);
      this.graphics.beginPath();
      this.graphics.moveTo(x + 1, y + 1);
      this.graphics.lineTo(x + 13, y + 1);
      this.graphics.lineTo(x + 12, y + 7);
      this.graphics.lineTo(x + 7, y + 12);
      this.graphics.lineTo(x + 2, y + 7);
      this.graphics.closePath();
      this.graphics.fillPath();

      this.graphics.lineStyle(2, COLORS.player, 1);
      this.graphics.strokePath();
      this.graphics.fillStyle(COLORS.player);
      this.graphics.fillRect(x - 3, y - 7, 6, 1);
      this.graphics.fillCircle(x + 7, y + 6, 2);
    }

    this.extraText.setText(count > shown ? `+${count - shown}` : '');
  }
}
