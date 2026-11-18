import {
  getSoundToggleLabel,
  playButtonSound,
  toggleSound,
} from '../audio.js';
import { COLORS, COLOR_HEX, FONT, GAME_HEIGHT, GAME_WIDTH } from '../config.js';

const CORNER_RADIUS = 12;
const BUTTON_HEIGHT = 56;
const BUTTON_WIDTH = 286;

export function createButton(scene, {
  x,
  y,
  label,
  primary = true,
  width = BUTTON_WIDTH,
  fontSize = '24px',
  onClick,
}) {
  const container = scene.add.container(x, y);
  const background = scene.add.graphics();
  const left = -width / 2;
  const top = -BUTTON_HEIGHT / 2;

  background.fillStyle(primary ? COLORS.player : COLORS.background);
  background.fillRoundedRect(left, top, width, BUTTON_HEIGHT, CORNER_RADIUS);
  if (!primary) {
    background.lineStyle(3, COLORS.player, 1);
    background.strokeRoundedRect(left, top, width, BUTTON_HEIGHT, CORNER_RADIUS);
  }

  const text = scene.add.text(0, 0, label, {
    fontFamily: FONT,
    fontSize,
    color: primary ? COLOR_HEX.background : COLOR_HEX.player,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  container.add([background, text]);
  if (onClick) {
    background.setInteractive(
      new Phaser.Geom.Rectangle(left, top, width, BUTTON_HEIGHT),
      Phaser.Geom.Rectangle.Contains,
    );
    background.input.cursor = 'pointer';
    background.on('pointerdown', () => {
      playButtonSound(scene);
      onClick();
    });
  }

  container.labelText = text;
  return container;
}

export function createSoundToggleButton(scene) {
  const button = createButton(scene, {
    x: 350,
    y: 132,
    label: getSoundToggleLabel(),
    width: 56,
    fontSize: '14px',
    onClick: () => {
      toggleSound(scene);
      button.labelText.setText(getSoundToggleLabel());
    },
  });
  return button.setDepth(120);
}

export function createPopup(scene, {
  x,
  y,
  width,
  height,
  borderColor,
}) {
  const container = scene.add.container(0, 0);
  const backdrop = scene.add.rectangle(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    GAME_WIDTH,
    GAME_HEIGHT,
    COLORS.background,
    0.96,
  );
  const panel = scene.add.graphics();
  const left = x - width / 2;
  const top = y - height / 2;

  panel.fillStyle(COLORS.background);
  panel.fillRoundedRect(left, top, width, height, CORNER_RADIUS);
  panel.lineStyle(4, borderColor, 1);
  panel.strokeRoundedRect(left, top, width, height, CORNER_RADIUS);
  container.add([backdrop, panel]);

  return container;
}
