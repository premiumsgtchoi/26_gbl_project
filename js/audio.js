const SFX_VOLUME = 0.5;
const BGM_VOLUME = 0.3;
const RANDOM_DETUNE_CENTS = 50;
const BGM_KEY = 'bgm';

const SOUND_KEYS = Object.freeze({
  button: 'button',
  gateUp: 'gate-up',
  gateDown: 'gate-down',
  battleStart: 'battle-start',
  bossStart: 'boss-start',
  battleWin: 'battle-win',
  stageClear: 'stage-clear',
  stageFail: 'stage-fail',
  allClear: 'all-clear',
});

const AUDIO_FILES = {
  [SOUND_KEYS.button]: 'assets/audio/button.wav',
  [SOUND_KEYS.gateUp]: 'assets/audio/gate-up.wav',
  [SOUND_KEYS.gateDown]: 'assets/audio/gate-down.wav',
  [SOUND_KEYS.battleStart]: 'assets/audio/battle-start.wav',
  [SOUND_KEYS.bossStart]: 'assets/audio/boss-start.wav',
  [SOUND_KEYS.battleWin]: 'assets/audio/battle-win.wav',
  [SOUND_KEYS.stageClear]: 'assets/audio/stage-clear.wav',
  [SOUND_KEYS.stageFail]: 'assets/audio/stage-fail.wav',
  [SOUND_KEYS.allClear]: 'assets/audio/all-clear.wav',
  [BGM_KEY]: 'assets/audio/bgm.mp3',
};

let soundEnabled = true;
let ringerSilent = false;
let bgmSound;
let bgmStarted = false;

export function preloadAudio(scene) {
  Object.entries(AUDIO_FILES).forEach(([key, path]) => {
    if (!scene.cache.audio.exists(key)) {
      scene.load.audio(key, path);
    }
  });
}

function playEffect(scene, key) {
  if (!soundEnabled || !scene.cache.audio.exists(key)) {
    return;
  }

  const detune = key === SOUND_KEYS.button
    ? 0
    : Math.round((Math.random() * 2 - 1) * RANDOM_DETUNE_CENTS);
  scene.sound.play(key, { volume: SFX_VOLUME, detune });
}

function startBgm(scene) {
  if (!soundEnabled || bgmStarted || !scene.cache.audio.exists(BGM_KEY)) {
    return;
  }

  bgmSound = scene.sound.add(BGM_KEY, { loop: true, volume: BGM_VOLUME });
  bgmSound.play();
  bgmStarted = true;
}

export function startBgmAfterInteraction(scene) {
  if (!bgmStarted) {
    scene.input.once('pointerdown', () => startBgm(scene));
  }
}

export function playButtonSound(scene) {
  startBgm(scene);
  playEffect(scene, SOUND_KEYS.button);
}

export function playGateSound(scene, troopDelta) {
  if (troopDelta > 0) {
    playEffect(scene, SOUND_KEYS.gateUp);
  } else if (troopDelta < 0) {
    playEffect(scene, SOUND_KEYS.gateDown);
  }
}

export function playBattleStartSound(scene, isBoss) {
  playEffect(scene, isBoss ? SOUND_KEYS.bossStart : SOUND_KEYS.battleStart);
}

export function playBattleWinSound(scene) {
  playEffect(scene, SOUND_KEYS.battleWin);
}

export function playResultSound(scene, success, isFinalStage) {
  const key = success
    ? isFinalStage ? SOUND_KEYS.allClear : SOUND_KEYS.stageClear
    : SOUND_KEYS.stageFail;
  playEffect(scene, key);
}

export function getSoundToggleLabel() {
  return soundEnabled ? '소리\n끄기' : '소리\n켜기';
}

export function toggleSound(scene) {
  soundEnabled = !soundEnabled;
  scene.sound.mute = !soundEnabled || ringerSilent;

  if (soundEnabled) {
    startBgm(scene);
    playButtonSound(scene);
  }

  return soundEnabled;
}

export function setRingerSilent(sound, silent) {
  ringerSilent = silent;
  sound.mute = !soundEnabled || ringerSilent;
}
