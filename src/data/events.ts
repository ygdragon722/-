import type { GameEvent } from '../types/game';

export const EVENT_DB: Record<string, GameEvent[]> = {
  daiyu: [
    {
      req: 0,
      text: '（潇湘馆）你步入院中，见黛玉正坐在窗边，手持一本诗集，眉头微蹙。\n"宝哥哥，你今日怎么没去学堂，反倒来我这里躲懒？"',
      choices: [
        {
          text: '提供情绪价值："学堂里的文章哪有妹妹的诗有趣？" (消耗 10 心情)',
          cost: { mood: 10 },
          reward: { affection_daiyu: 5, mood: 20 },
          reply: '黛玉扑哧一笑："就你嘴甜，仔细舅舅查你的功课。"',
        },
        {
          text: '懂她的精神世界：送上《绝版古诗集》',
          req: { item: 'book_collection' },
          cost: { item: 'book_collection' },
          reward: { affection_daiyu: 15, mood: 30 },
          reply: '黛玉眼前一亮，接过书卷："难为你有心，这孤本我寻了许久。"',
        },
      ],
    },
    {
      req: 20,
      text: '（潇湘馆）一阵微风吹过，落花满地。黛玉正拿着花锄，眼角带着泪痕。\n"花谢花飞飞满天，红消香断有谁怜？"',
      choices: [
        {
          text: '陪伴内耗：默默帮她一起收拾落花 (消耗 15 心情)',
          cost: { mood: 15 },
          reward: { affection_daiyu: 15, mood: 10 },
          reply: '黛玉见你懂她，神色柔和了许多："难得你是个知己。"',
        },
        {
          text: '物质哄劝：送上【上等胭脂】逗她开心',
          req: { item: 'rouge' },
          cost: { item: 'rouge' },
          reward: { affection_daiyu: 10, mood: 20 },
          reply: '黛玉见那胭脂精致，破涕为笑："你倒会拿这些玩意儿哄我。"',
        },
      ],
    },
    {
      req: 40,
      text: '（沁芳闸）桃花正盛。你悄悄带着一本《西厢记》找到正在看落花的黛玉。\n"好哥哥，你藏着什么好书？快给我瞧瞧。"',
      choices: [
        {
          text: '【名场面】共读西厢 (需: 绝版古诗集, 消耗 20 心情)',
          req: { item: 'book_collection' },
          cost: { item: 'book_collection', mood: 20 },
          reward: { affection_daiyu: 30, mood: 50 },
          reply: '黛玉看着书中的痴词丽句，只觉词藻警人，余香满口。你看向她："我就是个多愁多病身，你就是那倾国倾城貌。"黛玉微红了脸，微嗔道："你这该死的..."',
        },
      ],
    },
  ],
  baochai: [
    {
      req: 0,
      text: '（蘅芜苑）宝钗正和莺儿打红梅络子，见你来了，放下手中的活计，温和地看着你。\n"宝兄弟，近日可有温习《四书》？姨丈前日还问起你。"',
      choices: [
        {
          text: '展现上进心："正要请教宝姐姐，这篇策论我有些不懂。" (需 才学>50)',
          req: { talent: 50 },
          cost: { mood: 10 },
          reward: { affection_baochai: 10, talent: 10 },
          reply: '宝钗露出赞许的神色："你能这般上进，是极好的。我且讲与你听..."',
        },
        {
          text: '摆烂发言："哎呀，好姐姐，咱们且不说这些俗事。"',
          reward: { affection_baochai: -2, mood: 5 },
          reply: '宝钗无奈地摇摇头："你呀，总是这般贪玩，将来可怎么好？"',
        },
      ],
    },
    {
      req: 20,
      text: '（蘅芜苑）宝钗正在看账本，见你过来，让人端上冷香丸配的茶。\n"最近家里开销大，我也帮着看看账。你若能早日顶立门户，姨妈便也安心了。"',
      choices: [
        {
          text: '提供现实资源：拿【百年人参】给姐姐添置补品',
          req: { item: 'ginseng' },
          cost: { item: 'ginseng' },
          reward: { affection_baochai: 20 },
          reply: '宝钗微微感动："这等贵重之物你也舍得拿来，你竟也懂得体贴人了。"',
        },
      ],
    },
    {
      req: 40,
      text: '（滴翠亭）宝钗正追着一双玉色蝴蝶，香汗淋漓。见你走来，她停下脚步，神色渐渐严肃。\n"宝兄弟，你才学已有长进，但不可只顾闺阁私情，也该结交些仕途经济的朋友，方为正途。"',
      choices: [
        {
          text: '【名场面】听从规劝，探讨仕途 (需 才学>100)',
          req: { talent: 100 },
          cost: { mood: 20 },
          reward: { affection_baochai: 30, talent: 30 },
          reply: '你耐下性子与她探讨起朝堂局势。宝钗眼中闪过异彩，深觉你终于堪当大任，两人引为同道中人。',
        },
      ],
    },
  ],
  xiangyun: [
    {
      req: 0,
      text: '（沁芳亭）大老远就听见湘云爽朗的笑声。她穿着男装，正指挥着丫鬟们烤鹿肉。\n"爱哥哥！你来得正好，快来尝尝这烤肉，香得很！"',
      choices: [
        {
          text: '加入派对："我也来帮忙！" (消耗 10 心情)',
          cost: { mood: 10 },
          reward: { affection_xiangyun: 10, mood: 25 },
          reply: '两人一起大快朵颐，湘云笑得前仰后合，好不快活。',
        },
        {
          text: '派对赞助商：拿出买好的【惠泉酒】助兴',
          req: { item: 'wine' },
          cost: { item: 'wine' },
          reward: { affection_xiangyun: 20, mood: 15 },
          reply: '湘云大喜，拍手叫好："还是爱哥哥懂我！有肉无酒怎么行，今日定要不醉不归！"',
        },
      ],
    },
    {
      req: 20,
      text: '（沁芳亭）湘云正在亭子里比划剑法，英姿飒爽。\n"爱哥哥，成天闷在屋里作甚，不如与我出去骑马？"',
      choices: [
        {
          text: '来场说走就走的旅行："好！痛快玩一场！" (消耗 20 心情)',
          cost: { mood: 20 },
          reward: { affection_xiangyun: 20, mood: 40 },
          reply: '湘云大笑："这才爽快！"两人玩得满头大汗才归。',
        },
      ],
    },
    {
      req: 40,
      text: '（芍药栏）你遍寻湘云不着，最后在一张石凳上发现了她。她早已喝醉，卧在芍药花丛中，香梦沉酣，落花飞了一身。\n"泉香而酒冽...玉碗盛来琥珀光..."',
      choices: [
        {
          text: '【名场面】醉眠芍药裀 (需: 惠泉酒)',
          req: { item: 'wine' },
          cost: { item: 'wine' },
          reward: { affection_xiangyun: 30, mood: 60 },
          reply: '你悄悄拿新酒换下她手中的空杯，并在旁为她打扇遮阳。半晌，她迷糊醒来，见你在旁，相视大笑，世间繁华皆抛之脑后。',
        },
      ],
    },
  ],
  tanchun: [
    {
      req: 0,
      text: '（秋爽斋）探春正在桌前拟定园子里的新规矩，雷厉风行，不怒自威。\n"二哥哥来得正好，这园子里各项开支庞杂，我正打算包给下人们去管，你觉得如何？"',
      choices: [
        {
          text: '支持改革："三妹妹这主意极好，开源节流才是长久之计。" (需 才学>30)',
          req: { talent: 30 },
          cost: { mood: 10 },
          reward: { affection_tanchun: 10, talent: 10 },
          reply: '探春满意地点头："难得二哥哥是个明白人，不似那些只知吃酒看花的俗物。"',
        },
        {
          text: '泼冷水："自家姊妹，何必算得这么清楚？"',
          reward: { affection_tanchun: -5, mood: 5 },
          reply: '探春冷笑一声："你只顾眼前的富贵，哪知背后的亏空？罢了，不与你说这些。"',
        },
      ],
    },
    {
      req: 20,
      text: '（秋爽斋）探春正在核对账目，眉宇间带着一丝疲惫。\n"这些刁奴欺上瞒下，若没有个精准的章程，实在难以服众。"',
      choices: [
        {
          text: '赠送【西洋怀表】助她管理时间',
          req: { item: 'watch' },
          cost: { item: 'watch' },
          reward: { affection_tanchun: 20, silver: 150 },
          reply: '探春把玩着怀表，大喜过望："有了此物，定能让那些下人按时按点当差！二哥哥，这权当是我给你的分红。" (获得 150 两银子回报)',
        },
      ],
    },
    {
      req: 40,
      text: '（秋爽斋）探春将一厚沓账册拍在桌上，目光如炬。\n"如今大观园已能自负盈亏。二哥哥，若你有心，不如随我一同入世，将这贾府的产业重新整顿一番！"',
      choices: [
        {
          text: '【名场面】秋爽斋合伙人 (需 银两>500)',
          req: { silver: 500 },
          cost: { silver: 500 },
          reward: { affection_tanchun: 30, talent: 50 },
          reply: '你拿出全部身家入股。探春眼中闪烁着野心与信任的光芒："好！就让你我兄妹二人，在这浊世中拼出一条大路来！"',
        },
      ],
    },
  ],
  xiren: [
    {
      req: 0,
      text: '（怡红院）袭人见你回来，连忙上前替你宽衣解带，又端上一碗热腾腾的建莲红枣汤。\n"二爷，今日去学堂累了吧？别总是贪玩，仔细老爷知道了又要生气。"',
      choices: [
        {
          text: '接受爹系说教并喝汤 (恢复 25 心情)',
          reward: { affection_xiren: 10, mood: 25 },
          reply: '袭人温柔地为你擦去汗水："二爷能听进劝，便是好的。"',
        },
        {
          text: '嫌她啰嗦，转身就走 (心情 -5)',
          cost: { mood: 5 },
          reward: { affection_xiren: -5 },
          reply: '袭人叹了口气，默默跟在你身后收拾东西。',
        },
      ],
    },
    {
      req: 20,
      text: '（怡红院）夜深了，你读书读得心烦意乱。袭人悄悄走进来，将自己攒下的一包碎银子放在你桌上。\n"二爷若是在外头手头紧，只管拿去用。但千万别再去做那些惹老爷生气的营生了。"',
      choices: [
        {
          text: '【ISFJ 的奉献】收下银两并道谢 (获得 200 两)',
          reward: { affection_xiren: 20, silver: 200, mood: 20 },
          reply: '你心中感动，袭人微微一笑："只要二爷好好的，我便安心了。"',
        },
      ],
    },
  ],
  qingwen: [
    {
      req: 0,
      text: '（怡红院）晴雯正靠在榻上嗑瓜子，见你进来，连眼皮都没抬一下。\n"哟，咱们的宝二爷还知道回来啊？我还以为你在外面被哪路神仙绊住脚了呢。"',
      choices: [
        {
          text: '就喜欢这种 ENTP 爆竹脾气：上前陪她斗嘴 (消耗 10 心情)',
          cost: { mood: 10 },
          reward: { affection_qingwen: 10, mood: 20 },
          reply: '晴雯见你一点不恼，扑哧一声笑了出来，一改方才的冷脸，拉着你坐下。',
        },
        {
          text: '"怎生这般不知规矩？" (心情 -10)',
          cost: { mood: 10 },
          reward: { affection_qingwen: -15 },
          reply: '晴雯把瓜子一摔："我就是这般没规矩的，二爷看不惯，打发我出去便是！"',
        },
      ],
    },
    {
      req: 20,
      text: '（怡红院）晴雯方才不小心跌折了你的扇骨，正生闷气。你走过去想安慰她，她却一别脸。\n"这破扇子，我就是看不顺眼！"',
      choices: [
        {
          text: '【名场面】千金难买一笑：拿【名贵折扇】给她撕着玩！',
          req: { item: 'fan' },
          cost: { item: 'fan' },
          reward: { affection_qingwen: 40, mood: 50 },
          reply: '你大笑着递过折扇："撕得好！只要你开心，撕多少把都行！"晴雯破涕为笑，嗤啦一声将扇子撕得粉碎。那清脆的声音，果然好听极了。',
        },
      ],
    },
  ],
  miaoyu: [
    {
      req: 0,
      text: '（栊翠庵）你刚踏入庵门，便闻到一股极清幽的茶香。妙玉正端坐蒲团上煮茶，见你来，语气平淡：\n"你这俗人也懂得来此？你且说说，这煮茶的水，是雨水好，还是雪水好？"',
      choices: [
        {
          text: '迎合 INTJ 的学术探讨："自然是梅花上的雪水更佳。" (需 才学>40)',
          req: { talent: 40 },
          cost: { mood: 10 },
          reward: { affection_miaoyu: 10, talent: 10 },
          reply: '妙玉微微颔首："看来你还不算太蠢。且赐你一杯。"',
        },
        {
          text: '俗人发言："管它什么水，能解渴就行。"',
          reward: { affection_miaoyu: -10, mood: 5 },
          reply: '妙玉眉头微蹙，命老嬷嬷直接将你请了出去："俗不可耐。"',
        },
      ],
    },
    {
      req: 20,
      text: '（栊翠庵）大雪纷飞，栊翠庵的红梅开得正盛。妙玉独自站在梅树下，显得有些寂寥。',
      choices: [
        {
          text: '赠送【老君眉】探讨茶道 (需: 老君眉)',
          req: { item: 'tea' },
          cost: { item: 'tea' },
          reward: { affection_miaoyu: 20, mood: 20 },
          reply: '妙玉接过茶匣，眼中闪过一丝讶异："难得你竟能寻来此物。罢了，你我便在此赏梅对弈一局吧。"',
        },
      ],
    },
    {
      req: 40,
      text: '（栊翠庵）你推门而入，却见妙玉正对着经书出神，手中的佛珠散落一地。见你进来，她猛然起身，眼眶微红。\n"你...你为何又要来乱我心智！"',
      choices: [
        {
          text: '【名场面】槛外人动凡心：走上前握住她的手 (需 心情>80)',
          req: { mood: 80 },
          cost: { mood: 20 },
          reward: { affection_miaoyu: 40, talent: 20 },
          reply: '你坚定地看着她："槛外人也好，槛内人也罢，我只知你我皆是红尘中人。"妙玉闭上双眼，一滴清泪滑落，终于放下了她所有的防备。',
        },
      ],
    },
  ],
};
