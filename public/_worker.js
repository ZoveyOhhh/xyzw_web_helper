export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. 代理 /api/weixin (对应 vite.config.js 第 106 行)
    if (url.pathname.startsWith('/api/weixin/')) {
      // 这里的 + url.search 是为了防止 AppID 丢失，这是 Cloudflare 特有的补丁
      const targetUrl = 'https://open.weixin.qq.com' + url.pathname.replace('/api/weixin', '') + url.search;
      
      return proxyRequest(request, targetUrl, {
        // 这里的 User-Agent 和你配置文件里的一模一样
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; Mi-4c Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.6.1.1220(0x26060135) NetType/WIFI Language/zh_CN",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Referer": "https://open.weixin.qq.com/"
      });
    }

    // 2. 代理 /api/weixin-long (对应 vite.config.js 第 118 行)
    if (url.pathname.startsWith('/api/weixin-long/')) {
      const targetUrl = 'https://long.open.weixin.qq.com' + url.pathname.replace('/api/weixin-long', '') + url.search;
      return proxyRequest(request, targetUrl, {
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; Mi-4c Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.6.1.1220(0x26060135) NetType/WIFI Language/zh_CN",
        "Accept": "*/*",
        "Referer": "https://open.weixin.qq.com/"
      });
    }

    // 3. 代理 /api/hortor (对应 vite.config.js 第 130 行)
    if (url.pathname.startsWith('/api/hortor/')) {
      const targetUrl = 'https://comb-platform.hortorgames.com' + url.pathname.replace('/api/hortor', '') + url.search;
      return proxyRequest(request, targetUrl, {
        "User-Agent": "Mozilla/5.0 (Linux; Android 12; 23117RK66C Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36",
        "Accept": "*/*",
        "Host": "comb-platform.hortorgames.com",
        "Connection": "keep-alive",
        "Content-Type": "text/plain; charset=utf-8",
        "Origin": "https://open.weixin.qq.com",
        "Referer": "https://open.weixin.qq.com/"
      });
    }

    // 其他请求直接放行
    return env.ASSETS.fetch(request);