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
  version: "1.0.2",
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

function parseDanmakuXML(xmlString) {
  const regex = /<d\s+p="([^"]+)">([\s\S]*?)<\/d>/g;
  const comments = [];
  let match;
  let cid = 0;

  while ((match = regex.exec(xmlString)) !== null) {
    const p = match[1];
    const m = match[2];
    comments.push({
      cid: cid++,
      p: p,
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

  const response = await Widget.http.get(
    `${danmu_server}/?url=${title}&ac=dm`,
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    }
  );

  // const response = await Widget.http.get(
  //   `${danmu_server}/?url=https://v.qq.com/x/cover/53q0eh78q97e4d1/x00174aq5no.html`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "User-Agent": "ForwardWidgets/1.0.0",
  //     },
  //   }
  // );

  console.log("danmu response:", printFirst200Chars(response.data));
  // const result = parseDanmakuXML(response.data);
  // console.log("danmu json response:", printFirst200Chars(result));
  return response.data;
}