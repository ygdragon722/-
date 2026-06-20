// 存档占位层：localStorage 单档（线性单一剧本，不需要多档位）。
// 关键：存档带版本号，版本不对或解析失败就当没有存档——绝不让旧档把新版本崩掉。
import { SAVE_VERSION } from './types';

const KEY = 'honglou_save_v1';

export interface SaveData {
  version: number;
  name: string | null;
  stage: string;
  marks: Record<string, unknown>;
  jadeChoice: string;
  girlChoice: string;
}

export function loadSave(): Omit<SaveData, 'version'> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== SAVE_VERSION) return null; // 旧版本存档直接丢弃，不强行迁移字段
    return data;
  } catch {
    return null; // 存档损坏/被手改也当没有，不让旧档崩页面
  }
}

export function writeSave(data: Omit<SaveData, 'version'>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
  } catch {
    // 隐私模式/容量满时静默失败，不影响继续游玩
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 同上，静默即可
  }
}
