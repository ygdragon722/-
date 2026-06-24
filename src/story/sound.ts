type SoundKind = 'tap' | 'choice' | 'dream';

const MUTE_KEY = 'honglou_audio_muted';

let audioContext: AudioContext | null = null;

export function isSoundMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // 音频偏好写入失败不影响继续游玩。
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  audioContext ??= new window.AudioContext();
  return audioContext;
}

function playTone(frequency: number, duration: number, volume: number, delay = 0) {
  const ctx = getAudioContext();
  if (!ctx || isSoundMuted()) return;

  const play = () => {
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  };

  if (ctx.state === 'suspended') {
    void ctx.resume().then(play).catch(() => {});
    return;
  }

  play();
}

function playNoise(duration: number, volume: number, delay = 0) {
  const ctx = getAudioContext();
  if (!ctx || isSoundMuted()) return;

  const play = () => {
    const start = ctx.currentTime + delay;
    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(start);
    source.stop(start + duration + 0.02);
  };

  if (ctx.state === 'suspended') {
    void ctx.resume().then(play).catch(() => {});
    return;
  }

  play();
}

export function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx || isSoundMuted()) return;
  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {});
  }
}

export function playUiSound(kind: SoundKind = 'tap') {
  if (isSoundMuted()) return;

  unlockAudio();

  if (kind === 'choice') {
    playTone(520, 0.11, 0.075);
    playTone(780, 0.16, 0.045, 0.04);
    playNoise(0.045, 0.035, 0.01);
    return;
  }

  if (kind === 'dream') {
    playTone(196, 0.28, 0.075);
    playTone(294, 0.32, 0.05, 0.035);
    playTone(392, 0.34, 0.05, 0.07);
    return;
  }

  playTone(620, 0.075, 0.055);
  playNoise(0.035, 0.018, 0.005);
}
