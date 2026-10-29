import { ArmyView } from '../entities/ArmyView.js';
import { COLORS, COLOR_HEX, FONT, GAME_WIDTH } from '../config.js';
import { DEMO_STAGE } from '../stageData.js';
import { GameHud } from '../ui/GameHud.js';
import { applyOperation } from '../utils/operations.js';

const PLAYER_Y = 670;
const EVENT_TRIGGER_Y = 610;
const LEFT_X = 110;
const RIGHT_X = 280;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.troops = DEMO_STAGE.startingTroops;
    this.playerX = GAME_WIDTH / 2;
    this.isPaused = false;
    this.isFinished = false;
    this.selectedPath = 0;

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.drawRoad();
    this.course = this.add.container(0, 0).setDepth(10);
    this.stageEvents = DEMO_STAGE.events.map((event) => this.createStageEvent(event));
    this.army = new ArmyView(this, this.playerX, PLAYER_Y);
    this.army.setCount(this.troops);
    this.hud = new GameHud(this, DEMO_STAGE.number, this.troops);
    this.bindInput();
  }

  update(_time, delta) {
    if (this.isPaused || this.isFinished) {
      return;
    }

    const distance = DEMO_STAGE.speed * (delta / 1000);
    for (const stageEvent of this.stageEvents) {
      if (stageEvent.handled) {
        continue;
      }
      stageEvent.container.y += distance;
      stageEvent.container.setVisible(stageEvent.container.y >= 150 && stageEvent.container.y < 730);
      if (stageEvent.container.y >= EVENT_TRIGGER_Y) {
        this.handleStageEvent(stageEvent);
        break;
      }
    }
  }

  bindInput() {
    const moveArmy = (pointer) => {
      if (!pointer.isDown || this.isFinished) {
        return;
      }
      this.playerX = Phaser.Math.Clamp(pointer.x, LEFT_X, RIGHT_X);
      this.army.setX(this.playerX);
    };

    this.input.on('pointerdown', moveArmy);
    this.input.on('pointermove', moveArmy);
  }

  drawRoad() {
    const graphics = this.add.graphics().setDepth(0);
    graphics.lineStyle(3, COLORS.player, 1);
    graphics.strokeRoundedRect(72, 136, 246, 590, 28);
    graphics.lineBetween(195, 150, 195, 726);
  }

  createStageEvent(data) {
    const container = this.add.container(0, data.y);
    const stageEvent = { data, container, handled: false };

    if (data.type === 'gate') {
      this.drawGatePair(container, data.choices);
    } else if (data.type === 'pathBattle') {
      this.drawPathEnemies(container, data.enemies);
    } else {
      this.drawBoss(container, data.enemies);
    }

    container.setVisible(data.y >= 150 && data.y < 730);
    this.course.add(container);
    return stageEvent;
  }

  drawGatePair(container, choices) {
    const paths = this.add.graphics();
    paths.lineStyle(3, COLORS.player, 1);
    paths.beginPath();
    paths.moveTo(195, 110);
    paths.lineTo(LEFT_X, 45);
    paths.lineTo(195, -45);
    paths.moveTo(195, 110);
    paths.lineTo(RIGHT_X, 45);
    paths.lineTo(195, -45);
    paths.strokePath();
    container.add(paths);

    choices.forEach((choice, index) => {
      const x = index === 0 ? LEFT_X : RIGHT_X;
      const color = this.getOperationColor(choice.operator);
      container.add(this.add.rectangle(x, 45, 112, 72, color));
      container.add(this.add.text(x, 45, `${choice.operator}${choice.value}`, {
        fontFamily: FONT,
        fontSize: '24px',
        color: COLOR_HEX.background,
        fontStyle: 'bold',
      }).setOrigin(0.5));
    });
  }

  drawPathEnemies(container, enemyCounts) {
    container.add(this.add.text(195, -60, '경로별 몬스터', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.enemy,
    }).setOrigin(0.5));

    enemyCounts.forEach((count, index) => {
      const x = index === 0 ? LEFT_X : RIGHT_X;
      container.add(this.createMonsterIcon(x, 0, false));
      container.add(this.add.text(x, 42, String(count), {
        fontFamily: FONT,
        fontSize: '24px',
        color: COLOR_HEX.enemy,
        fontStyle: 'bold',
      }).setOrigin(0.5));
    });
  }

  drawBoss(container, count) {
    container.add(this.add.text(195, -60, '최종 몬스터', {
      fontFamily: FONT,
      fontSize: '14px',
      color: COLOR_HEX.enemy,
    }).setOrigin(0.5));
    container.add(this.createMonsterIcon(195, 0, true));
    container.add(this.add.text(195, 52, String(count), {
      fontFamily: FONT,
      fontSize: '48px',
      color: COLOR_HEX.enemy,
      fontStyle: 'bold',
    }).setOrigin(0.5));
  }

  createMonsterIcon(x, y, boss) {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.enemy);
    const size = boss ? 27 : 19;
    graphics.fillTriangle(x, y - size, x - size, y + size, x + size, y + size);
    graphics.fillCircle(x, y - size + 2, boss ? 19 : 13);
    return graphics;
  }

  getOperationColor(operator) {
    return operator === '+' || operator === '×' ? COLORS.positive : COLORS.negative;
  }

  handleStageEvent(stageEvent) {
    stageEvent.handled = true;
    this.isPaused = true;
    stageEvent.container.setVisible(false);

    if (stageEvent.data.type === 'gate') {
      this.handleGate(stageEvent.data.choices);
    } else if (stageEvent.data.type === 'pathBattle') {
      this.startBattle(stageEvent.data.enemies[this.selectedPath], false);
    } else {
      this.startBattle(stageEvent.data.enemies, true);
    }
  }

  handleGate(choices) {
    const choiceIndex = this.playerX < GAME_WIDTH / 2 ? 0 : 1;
    const choice = choices[choiceIndex];
    const previousTroops = this.troops;
    this.selectedPath = choiceIndex;
    this.troops = applyOperation(this.troops, choice);
    this.updateTroops();
    this.hud.showChange(this.troops - previousTroops);
    this.hud.setStatus(`${choice.operator}${choice.value} 게이트 통과`);

    if (this.troops === 0) {
      this.time.delayedCall(600, () => this.finishStage(false));
      return;
    }

    this.time.delayedCall(700, () => {
      this.hud.setStatus('다음 경로를 선택하세요');
      this.isPaused = false;
    });
  }

  startBattle(enemyCount, isBoss) {
    let enemies = enemyCount;
    const battleView = this.createBattleView(enemies, isBoss);
    this.hud.setStatus(isBoss ? '최종 전투!' : `몬스터 ${enemyCount}마리와 전투`);

    const timer = this.time.addEvent({
      delay: 220,
      repeat: Math.max(enemyCount, this.troops) - 1,
      callback: () => {
        if (enemies > 0 && this.troops > 0) {
          enemies -= 1;
          this.troops -= 1;
          battleView.countText.setText(String(enemies));
          this.updateTroops();
        }

        if (enemies === 0 || this.troops === 0) {
          timer.remove(false);
          battleView.container.destroy();

          if (this.troops === 0) {
            this.finishStage(false);
          } else if (isBoss) {
            this.finishStage(true);
          } else {
            this.hud.setStatus('전투 승리! 경로가 다시 합류합니다', COLOR_HEX.positive);
            this.time.delayedCall(650, () => {
              this.playerX = GAME_WIDTH / 2;
              this.army.setX(this.playerX);
              this.hud.setStatus('다음 게이트를 선택하세요');
              this.isPaused = false;
            });
          }
        }
      },
    });
  }

  createBattleView(enemyCount, isBoss) {
    const container = this.add.container(this.playerX, 560).setDepth(30);
    const icon = this.createMonsterIcon(0, 0, isBoss);
    const countText = this.add.text(0, isBoss ? 52 : 38, String(enemyCount), {
      fontFamily: FONT,
      fontSize: isBoss ? '48px' : '24px',
      color: COLOR_HEX.enemy,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add([icon, countText]);
    return { container, countText };
  }

  updateTroops() {
    this.hud.setTroops(this.troops);
    this.army.setCount(this.troops);
  }

  finishStage(success) {
    if (this.isFinished) {
      return;
    }
    this.isFinished = true;
    this.isPaused = true;
    this.hud.setStatus(success ? '최종 몬스터 격파!' : '병력이 모두 사라졌습니다');
    this.time.delayedCall(500, () => {
      this.hud.showResult(success, this.troops, () => this.scene.restart());
    });
  }
}
