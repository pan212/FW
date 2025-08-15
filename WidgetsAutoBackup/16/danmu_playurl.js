/**
 * 弹幕示例模块
 * 给 module 指定 type 为 danmu 后，默认会携带以下参数：
 * tmdbId: TMDB ID，Optional
 * type: 类型，tv | movie
 * title: 标题
 * season: 季，电影时为空
 * episode: 集，电影时为空
 * link: 链接，Optional
 * videoUrl: 视频链接，Optional
 * commentId: 弹幕ID，Optional。在搜索到弹幕列表后实际加载时会携带
 * animeId: 动漫ID，Optional。在搜索到动漫列表后实际加载时会携带
 *
 */
WidgetMetadata = {
  id: "forward.playurl.danmu",
  title: "手动链接弹幕",
  version: "1.0.3",
  requiredVersion: "0.0.2",
  description: "从指定播放链接和服务器获取弹幕【五折码：CHEAP.5;七折码：CHEAP】",
  author: "huangxd",
  site: "https://github.com/huangxd-/ForwardWidgets",
  globalParams: [
    {
      name: "danmu_server",
      title: "自定义服务器",
      type: "input",
      placeholders: [
        {
          title: "lyz05",
          value: "https://fc.lyz05.cn",
        },
        {
          title: "56uxi",
          value: "https://danmu.56uxi.com",
        },
        {
          title: "hls",
          value: "https://dmku.hls.one",
        },
        {
          title: "icu",
          value: "https://api.danmu.icu",
        },
        {
          title: "678",
          value: "https://se.678.ooo",
        },
      ],
    },
  ],
  modules: [
    {
      //id需固定为searchDanmu
      id: "searchDanmu",
      title: "搜索弹幕",
      functionName: "searchDanmu",
      type: "danmu",
      params: [],
    },
    {
      //id需固定为getComments
      id: "getComments",
      title: "获取弹幕",
      functionName: "getCommentsById",
      type: "danmu",
      params: [],
    },
  ],
};

function printFirst200Chars(data) {
  let dataToPrint;

  if (typeof data === 'string') {
    dataToPrint = data;  // 如果是字符串，直接使用
  } else if (Array.isArray(data)) {
    dataToPrint = JSON.stringify(data);  // 如果是数组，转为字符串
  } else if (typeof data === 'object') {
    dataToPrint = JSON.stringify(data);  // 如果是对象，转为字符串
  } else {
    console.error("Unsupported data type");
    return;
  }

  console.log(dataToPrint.slice(0, 200));  // 打印前200个字符
}

async function searchDanmu(params) {
  const { tmdbId, type, title, season, link, videoUrl, danmu_server } = params;

  return {
    animes: [
    {
      "animeId": 1223,
      "bangumiId": "string",
      "animeTitle": title,
      "type": "tvseries",
      "typeDescription": "string",
      "imageUrl": "string",
      "startDate": "2025-08-08T13:25:11.189Z",
      "episodeCount": 12,
      "rating": 0,
      "isFavorited": true
    }],
  };
}

async function getDetailById(params) {
  const { danmu_server, animeId } = params;

  return [
      {
        "seasonId": "string",
        "episodeId": 1,
        "episodeTitle": "episode",
        "episodeNumber": "string",
        "lastWatched": "2025-08-08T13:26:42.844Z",
        "airDate": "2025-08-08T13:26:42.844Z"
      }
    ];
}

function generateDanmaku(message, count) {
  const comments = [];
  const baseP = "1,1,25,16777215,1754803089,0,0,26732601000067074,1"; // 原始 p 字符串

  for (let i = 0; i < count; i++) {
    // 增加 cid
    const cid = i;

    // 修改 p 的第一位数字，加 5
    const pParts = baseP.split(',');
    pParts[0] = (parseInt(pParts[0], 10) + i * 5).toString(); // 每次增加 i * 5
    const updatedP = pParts.join(',');

    // 使用传入的 m 参数
    const m = message;

    // 生成每个弹幕对象
    comments.push({
      cid: cid,
      p: updatedP,
      m: m
    });
  }

  return {
    count: comments.length,
    comments: comments
  };
}

async function getCommentsById(params) {
  const { danmu_server, commentId, link, videoUrl, season, episode, tmdbId, type, title } = params;

  const danmu_server_list = [
        "https://fc.lyz05.cn",
        "https://danmu.56uxi.com",
        "https://dmku.hls.one",
        "https://api.danmu.icu",
        "https://se.678.ooo",
    ];

    // 统一的请求函数
    async function fetchDanmu(server) {
        try {
            const response = await Widget.http.get(
                `${server}/?url=${title}&ac=dm`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    },
                }
            );

            console.log(`danmu response from ${server}: ↓↓↓`);
            printFirst200Chars(response.data);

            const danmuCount = parseDanmuku(response.data);
            return danmuCount >= 5 ? response.data : null; // 如果弹幕数大于等于 5，返回弹幕数据
        } catch (error) {
            console.error(`请求 ${server} 失败:`, error);
            return null;  // 如果请求失败，返回 null
        }
    }

    // 先查询传入的 danmu_server
    let result = await fetchDanmu(danmu_server);
    if (result) return result;

    // 如果传入的 danmu_server 不满足条件，查询 danmu_server_list 中的其他服务器
    for (let server of danmu_server_list) {
        if (server === danmu_server) continue;  // 如果是传入的 danmu_server，跳过

        result = await fetchDanmu(server);
        if (result) return result;  // 如果获取到有效弹幕，返回弹幕数据
    }

    // 如果遍历完所有服务器都没有获得有效弹幕，返回默认错误信息
    return generateDanmaku(`【自动链接弹幕】：弹幕服务器异常，轮询后还是未获得到有效弹幕`, 1);
}

function parseDanmuku(responseData) {
  let danmukuArray = [];
  let length = 0;

  try {
    // 检测是否为 XML 格式（基于字符串开头）
    if (typeof responseData === 'string' && (responseData.trim().startsWith('<?xml') || responseData.trim().startsWith('<'))) {
      // 处理 XML 格式
      // 使用正则表达式匹配所有 <d> 标签以计算总数
      const danmukuRegex = /<d p="([^"]+)">([^<]+)<\/d>/g;
      const allDanmuku = responseData.match(danmukuRegex) || [];
      length = allDanmuku.length;

      // 提取前 10 条弹幕
      let count = 0;
      let match;
      danmukuRegex.lastIndex = 0; // 重置正则索引
      while ((match = danmukuRegex.exec(responseData)) !== null && count < 10) {
        const attr = match[1]; // p 属性值
        const content = match[2]; // 弹幕内容
        const [time, type, fontSize, color, sender, ...others] = attr.split(','); // 解析属性
        danmukuArray.push({
          time: parseFloat(time),
          content: content,
          type: parseInt(type),
          color: `#${parseInt(color).toString(16).padStart(6, '0')}`,
          fontSize: parseInt(fontSize)
        });
        count++;
      }
    } else {
      // 处理 JSON 格式
      const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
      const danmukuList = data.danmuku || data; // 支持 { danmuku: [...] } 或直接 [...] 格式
      length = danmukuList.length;
      danmukuArray = danmukuList.slice(0, 10); // 提取前 10 条
    }

    // 输出前 10 条弹幕
    console.log('前 10 条弹幕:', danmukuArray);
    console.log('获取到弹幕总数:', length);
    return length;
  } catch (error) {
    console.error('解析弹幕失败:', error);
    return 0;
  }
}