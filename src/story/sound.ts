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

  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playUiSound(kind: SoundKind = 'tap') {
  if (isSoundMuted()) return;

  if (kind === 'choice') {
    playTone(520, 0.09, 0.032);
    playTone(780, 0.14, 0.018, 0.035);
    return;
  }

  if (kind === 'dream') {
    playTone(196, 0.2, 0.025);
    playTone(392, 0.28, 0.016, 0.055);
    return;
  }

  playTone(620, 0.06, 0.018);
}
