import type { Tutorial } from '@/types'

export const TUTORIALS: Tutorial[] = [
  {
    id: 'tut-ac-filter-clean',
    title: '如何清洗空调滤网',
    description: '定期清洗空调滤网可以提高制冷效率、改善室内空气质量，建议每3个月清洗一次。',
    applianceType: 'air_conditioner',
    category: '滤网清洁',
    difficulty: 'easy',
    estimatedTime: '15分钟',
    steps: [
      {
        id: 'step-1',
        title: '关闭电源并打开面板',
        description: '先关闭空调电源，拔掉插头确保安全。轻轻向上推动空调面板，听到"咔哒"声后停住。',
        tips: '如果面板很紧，可以用双手从两侧均匀用力',
      },
      {
        id: 'step-2',
        title: '取出滤网',
        description: '找到滤网的卡扣位置，轻轻向下按压卡扣，同时向外拉出滤网。',
        tips: '注意滤网的安装方向，记住正反面以便正确装回',
      },
      {
        id: 'step-3',
        title: '清洁滤网',
        description: '用吸尘器吸除表面灰尘，或用清水冲洗。如果油污较重，可以用中性清洁剂稀释后浸泡10分钟。',
        warning: '不要用硬毛刷刷洗，以免损坏滤网',
      },
      {
        id: 'step-4',
        title: '晾干滤网',
        description: '将清洗后的滤网放在阴凉通风处自然晾干，避免阳光直射或用吹风机吹干。',
        tips: '确保滤网完全干燥后再安装，防止滋生霉菌',
      },
      {
        id: 'step-5',
        title: '装回滤网并合上面板',
        description: '按照取出时的相反方向装回滤网，确保卡扣卡紧。轻轻按下面板使其闭合。',
      },
    ],
    tools: ['吸尘器或软毛刷', '清水', '中性清洁剂（可选）', '干净毛巾'],
    safetyNotes: ['务必断电后操作', '不要用腐蚀性清洁剂', '滤网未干时不要开机'],
  },
  {
    id: 'tut-wm-seal-clean',
    title: '如何清理洗衣机胶圈',
    description: '洗衣机胶圈容易藏污纳垢，定期清理可以防止异味和霉菌滋生，建议每月检查清洁。',
    applianceType: 'washing_machine',
    category: '胶圈清洁',
    difficulty: 'easy',
    estimatedTime: '20分钟',
    steps: [
      {
        id: 'step-1',
        title: '准备清洁材料',
        description: '准备白醋、小苏打、干净抹布、旧牙刷和橡胶手套。',
      },
      {
        id: 'step-2',
        title: '擦拭表面污垢',
        description: '戴上手套，用湿抹布擦拭胶圈表面，清除可见的灰尘和污渍。',
        tips: '可以用温水浸湿抹布，更容易软化污垢',
      },
      {
        id: 'step-3',
        title: '清理褶皱深处',
        description: '翻开胶圈的褶皱部分，用旧牙刷蘸取白醋或小苏打溶液，仔细刷洗缝隙中的霉菌和污垢。',
        warning: '注意不要用力过猛，以免损坏胶圈',
      },
      {
        id: 'step-4',
        title: '除霉处理',
        description: '如果有顽固霉斑，可以用抹布蘸取白醋敷在霉斑处10分钟，然后再刷洗。',
        tips: '也可以使用专用的洗衣机槽清洁剂',
      },
      {
        id: 'step-5',
        title: '清水冲洗并擦干',
        description: '用清水冲洗胶圈，然后用干净的干毛巾彻底擦干，包括褶皱内部。',
        tips: '每次洗完衣服后，打开门让胶圈通风晾干，可以有效防止霉菌滋生',
      },
    ],
    tools: ['白醋', '小苏打', '干净抹布', '旧牙刷', '橡胶手套'],
    safetyNotes: ['不要使用漂白剂，会损坏胶圈', '清洁后确保擦干，保持干燥', '如果胶圈有破损请及时更换'],
  },
  {
    id: 'tut-wm-tub-clean',
    title: '如何清洗洗衣机内筒',
    description: '洗衣机内筒长期使用会积累水垢和洗涤剂残留，建议每6个月深度清洁一次。',
    applianceType: 'washing_machine',
    category: '内筒清洁',
    difficulty: 'medium',
    estimatedTime: '2小时',
    steps: [
      {
        id: 'step-1',
        title: '购买专用清洁剂',
        description: '选购洗衣机槽专用清洁剂，或使用白醋和小苏打组合。',
      },
      {
        id: 'step-2',
        title: '设置高温清洁程序',
        description: '将洗衣机设置为最高水位和最高温度（建议60°C以上），加入清洁剂。',
        warning: '不要放入衣物',
      },
      {
        id: 'step-3',
        title: '浸泡',
        description: '当洗衣机注水完成、搅拌5分钟后，暂停程序，让内筒浸泡1-2小时。',
        tips: '污渍严重时可以延长浸泡时间',
      },
      {
        id: 'step-4',
        title: '运行完整程序',
        description: '继续运行洗衣程序，让清洁剂充分作用并排出污水。',
      },
      {
        id: 'step-5',
        title: '二次冲洗',
        description: '程序结束后，再运行一次漂洗程序，确保清洁剂残留被彻底冲洗干净。',
      },
      {
        id: 'step-6',
        title: '擦拭外部',
        description: '用干净抹布擦拭洗衣机门、密封圈和外壳。打开门通风晾干。',
      },
    ],
    tools: ['洗衣机槽清洁剂（或白醋+小苏打）', '干净抹布'],
    safetyNotes: ['不要混合多种清洁剂', '高温程序注意防止烫伤', '清洗后保持通风干燥'],
  },
  {
    id: 'tut-ac-evaporator-clean',
    title: '如何清洁空调蒸发器',
    description: '空调蒸发器是热交换的核心部件，清洁后可以大幅提高制冷效率。',
    applianceType: 'air_conditioner',
    category: '深度清洁',
    difficulty: 'medium',
    estimatedTime: '45分钟',
    steps: [
      {
        id: 'step-1',
        title: '断电并打开面板',
        description: '关闭空调电源，拔掉插头。打开面板并取出滤网。',
      },
      {
        id: 'step-2',
        title: '准备专业清洁剂',
        description: '购买空调蒸发器专用清洁剂，使用前充分摇匀。',
      },
      {
        id: 'step-3',
        title: '喷洒清洁剂',
        description: '将清洁剂均匀喷洒在蒸发器翅片上，注意覆盖所有部位。',
        warning: '不要喷到电器元件和传感器上',
      },
      {
        id: 'step-4',
        title: '静置溶解',
        description: '让清洁剂静置15-20分钟，充分溶解翅片上的灰尘和油污。',
      },
      {
        id: 'step-5',
        title: '运行制冷程序',
        description: '装回滤网，通电运行制冷程序15-20分钟，让冷凝水将溶解的污垢冲洗干净。',
        tips: '可以在室内机下方放置毛巾，防止冷凝水滴落',
      },
    ],
    tools: ['空调蒸发器专用清洁剂', '螺丝刀（如需拆卸外壳）', '毛巾'],
    safetyNotes: ['必须断电操作', '使用清洁剂时保持通风', '如果不确定操作，建议请专业人员'],
  },
  {
    id: 'tut-rh-filter-clean',
    title: '如何清洗油烟机滤网',
    description: '油烟机滤网长期积累油污，会影响排烟效果，建议每3个月清洗一次。',
    applianceType: 'range_hood',
    category: '滤网清洁',
    difficulty: 'easy',
    estimatedTime: '30分钟',
    steps: [
      {
        id: 'step-1',
        title: '取下滤网',
        description: '找到滤网卡扣，按下并向下拉出滤网。注意接住可能滴落的油污。',
        tips: '可以在下方垫报纸或毛巾',
      },
      {
        id: 'step-2',
        title: '浸泡去污',
        description: '准备一盆热水（约60°C），加入洗洁精或小苏打，将滤网浸泡20-30分钟。',
        warning: '水温不要过高，以免滤网变形',
      },
      {
        id: 'step-3',
        title: '刷洗干净',
        description: '用软毛刷顺着滤网网格方向刷洗，清除油污。',
        tips: '可以使用旧牙刷清洁缝隙',
      },
      {
        id: 'step-4',
        title: '冲洗晾干',
        description: '用清水冲洗干净，放在通风处晾干。',
      },
      {
        id: 'step-5',
        title: '清洁油杯',
        description: '顺便清洁油杯，倒掉积油，用洗洁精清洗干净。',
      },
      {
        id: 'step-6',
        title: '装回滤网',
        description: '确认滤网完全干燥后，按照拆卸的相反顺序装回。',
      },
    ],
    tools: ['热水', '洗洁精或小苏打', '软毛刷', '旧牙刷', '抹布', '报纸'],
    safetyNotes: ['操作时注意防滑', '使用热水防止烫伤', '油污严重时可延长浸泡时间'],
  },
  {
    id: 'tut-fridge-clean',
    title: '如何深度清洁冰箱',
    description: '定期清洁冰箱可以保持食物新鲜、去除异味，建议每6个月深度清洁一次。',
    applianceType: 'refrigerator',
    category: '内部清洁',
    difficulty: 'easy',
    estimatedTime: '1小时',
    steps: [
      {
        id: 'step-1',
        title: '清空冰箱',
        description: '将冰箱内的食物全部取出，分类放置在阴凉处。注意易变质食品要妥善保存。',
        tips: '清洁前一天减少购买新食物，尽量清空冰箱',
      },
      {
        id: 'step-2',
        title: '断电除霜',
        description: '拔掉电源插头，打开冰箱门，让霜层自然融化。可以在底部放置毛巾吸收融化的水。',
        warning: '不要用尖锐物品铲冰，以免损坏蒸发器',
      },
      {
        id: 'step-3',
        title: '取出可拆卸部件',
        description: '将搁架、抽屉、门封条等可拆卸部件取出，拿到水槽清洗。',
      },
      {
        id: 'step-4',
        title: '清洗内部',
        description: '用温水加小苏打（比例：1升水+2汤匙小苏打）擦拭冰箱内壁。',
        tips: '小苏打可以有效去除异味',
      },
      {
        id: 'step-5',
        title: '清洁门封条',
        description: '用旧牙刷蘸取清洁剂，仔细刷洗门封条缝隙中的污垢。',
      },
      {
        id: 'step-6',
        title: '擦干并晾干',
        description: '用干净抹布擦干内部和所有部件，打开门通风30分钟。',
      },
      {
        id: 'step-7',
        title: '装回部件和食物',
        description: '按照分类整理食物，装回冰箱。注意检查食物保质期。',
      },
    ],
    tools: ['小苏打', '温水', '干净抹布', '旧牙刷', '毛巾', '保鲜袋或保温袋'],
    safetyNotes: ['清洁前务必断电', '不要用强腐蚀性清洁剂', '冰箱背面冷凝器也要定期吸尘'],
  },
  {
    id: 'tut-robot-clean',
    title: '如何清洁保养扫地机器人',
    description: '定期清洁扫地机器人的滚刷、尘盒和传感器，可以保持最佳清洁效果。',
    applianceType: 'robot_vacuum',
    category: '常规保养',
    difficulty: 'easy',
    estimatedTime: '20分钟',
    steps: [
      {
        id: 'step-1',
        title: '关闭电源',
        description: '关闭机器人电源开关，确保安全操作。',
      },
      {
        id: 'step-2',
        title: '清理尘盒',
        description: '取出尘盒，倒掉垃圾，用清洁刷刷洗滤网，或更换新的滤网。',
        tips: '滤网建议每3个月更换一次',
      },
      {
        id: 'step-3',
        title: '清理滚刷',
        description: '取下滚刷，用清理工具切断并清除缠绕的毛发。检查滚刷两端轴承。',
      },
      {
        id: 'step-4',
        title: '清洁边刷',
        description: '清理边刷上缠绕的毛发，如果边刷弯曲变形，建议更换。',
      },
      {
        id: 'step-5',
        title: '擦拭传感器',
        description: '用干净的干布轻轻擦拭悬崖传感器和碰撞传感器。',
        warning: '不要用湿布擦拭传感器和充电触点',
      },
      {
        id: 'step-6',
        title: '清洁轮子',
        description: '检查万向轮和驱动轮，清除缠绕的毛发和杂物。',
      },
      {
        id: 'step-7',
        title: '清洁充电触点',
        description: '用干布擦拭机器人底部和充电座的充电触点，确保接触良好。',
      },
    ],
    tools: ['清洁刷（通常随机器附赠）', '剪刀或专用切割工具', '干净抹布', '新滤网（备用）'],
    safetyNotes: ['不要水洗主滤网', '不要用湿抹布接触电器部件', '如果发现部件损坏及时更换'],
  },
  {
    id: 'tut-water-heater-clean',
    title: '如何清洗热水器内胆',
    description: '热水器长期使用会积累水垢，影响加热效率，建议每12个月清洗一次。',
    applianceType: 'water_heater',
    category: '内胆除垢',
    difficulty: 'hard',
    estimatedTime: '2小时',
    steps: [
      {
        id: 'step-1',
        title: '断电断水',
        description: '关闭电源（拔掉插头或关闭空气开关），关闭进水阀门。',
        warning: '储水式热水器必须断电操作，确保安全',
      },
      {
        id: 'step-2',
        title: '排空内胆',
        description: '打开热水龙头排气，连接排水管到排污口，打开排污阀排空内胆中的水。',
        tips: '注意水温，防止烫伤',
      },
      {
        id: 'step-3',
        title: '拆卸加热管',
        description: '待水排空后，用扳手拆卸加热管法兰盘，取出加热管。',
        warning: '如果对操作不熟悉，建议请专业人员',
      },
      {
        id: 'step-4',
        title: '清理水垢',
        description: '清除加热管上的水垢，同时从加热管安装口清理内胆底部的水垢。',
      },
      {
        id: 'step-5',
        title: '冲洗内胆',
        description: '打开进水阀，用清水冲洗内胆，直到排出的水变清。',
      },
      {
        id: 'step-6',
        title: '装回加热管',
        description: '检查并更换密封圈，装回加热管，按规定扭矩拧紧法兰盘螺丝。',
      },
      {
        id: 'step-7',
        title: '注水排气',
        description: '关闭排污阀，打开进水阀，同时打开热水龙头，直到热水龙头出水，排除内胆空气。',
      },
      {
        id: 'step-8',
        title: '检查漏水并通电',
        description: '检查各连接处是否漏水，确认无漏水后接通电源。',
      },
    ],
    tools: ['扳手', '螺丝刀', '排水管', '除垢剂（可选）', '新密封圈', '漏斗'],
    safetyNotes: ['必须断电操作，防止触电', '排水时注意水温，防止烫伤', '更换镁棒建议同时进行', '如果不确定操作，务必请专业人员'],
  },
]

export const TUTORIAL_MAP = Object.fromEntries(
  TUTORIALS.map((t) => [t.id, t])
) as Record<string, Tutorial>

export const getTutorialsByApplianceType = (type: string): Tutorial[] => {
  return TUTORIALS.filter((t) => t.applianceType === type)
}
