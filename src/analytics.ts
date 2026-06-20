// 行为埋点占位层：现在只打印到 console，先把"打点的位置"定下来，
// 上线前换成真实上报（如 Plausible/自建埋点接口），调用方不用改一行。
// 对外措辞规避 "MBTI" 商标，统一用"读法/性格类型"。

type ReadKeyEvent = {
  npcId: string;
  readKey: string; // empathy / logic / flatter / confront / observe / play / defer
  reachedTruth: boolean; // 这次读法是否撬开了真话（无对错，只记录是否走到这一层）
};

type MoralChoiceEvent = {
  choice: 'jade' | 'girl';
  value: string; // jade: reveal/hide ｜ girl: remember/leave
  ignite: boolean; // 是否对应"点燃真相"那一支（girl=remember 时为 true）
};

function emit(name: string, payload: Record<string, unknown>) {
  // 占位实现：先落 console，方便本地核对埋点是否在正确的位置触发
  console.debug(`[track] ${name}`, payload);
}

// 每场读人相遇结束时调用：记录这场用了什么读法、有没有读到真话
export function trackRead(event: ReadKeyEvent) {
  emit('read_resolve', event);
}

// 第三天两个抉择各自调用一次：记录选了什么、是否点燃真相
export function trackMoralChoice(event: MoralChoiceEvent) {
  emit('moral_choice', event);
}

// 通关时调用：记录最终归纳出的"读你"原型，供以后统计哪种读法分布最多
export function trackEndingReached(mirrorPrototype: string) {
  emit('ending_reached', { mirrorPrototype });
}
