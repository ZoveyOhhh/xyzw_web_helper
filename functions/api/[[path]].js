export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  let targetUrl = '';
  // Clone headers to modify them
  let headers = new Headers(request.headers);

  // Headers definitions from vite.config.js
  const commonUserAgent = "Mozilla/5.0 (Linux; Android 7.0; Mi-4c Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.6.1.1220(0x26060135) NetType/WIFI Language/zh_CN";
  const commonAccept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
  const hortorUserAgent = "Mozilla/5.0 (Linux; Android 12; 23117RK66C Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36";

  if (path.startsWith('/api/weixin-long')) {
    // /api/weixin-long -> https://long.open.weixin.qq.com
    const newPath = path.replace('/api/weixin-long', '');
    targetUrl = 'https://long.open.weixin.qq.com' + newPath + url.search;
    headers.set('User-Agent', commonUserAgent);
    headers.set('Accept', '*/*');
    headers.set('Referer', 'https://open.weixin.qq.com/');
    headers.set('Origin', 'https://open.weixin.qq.com');
  } else if (path.startsWith('/api/weixin')) {
    // /api/weixin -> https://open.weixin.qq.com
    const newPath = path.replace('/api/weixin', '');
    targetUrl = 'https://open.weixin.qq.com' + newPath + url.search;
    headers.set('User-Agent', commonUserAgent);
    headers.set('Accept', commonAccept);
    headers.set('Referer', 'https://open.weixin.qq.com/');
    headers.set('Origin', 'https://open.weixin.qq.com');
  } else if (path.startsWith('/api/hortor')) {
    // /api/hortor -> https://comb-platform.hortorgames.com
    const newPath = path.replace('/api/hortor', '');
    targetUrl = 'https://comb-platform.hortorgames.com' + newPath + url.search;
    headers.set('User-Agent', hortorUserAgent);
    headers.set('Accept', '*/*');
    // Host header is automatically set by fetch based on URL
    headers.set('Connection', 'keep-alive');
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('Origin', 'https://open.weixin.qq.com');
    headers.set('Referer', 'https://open.weixin.qq.com/');
  } else {
    // If it's an API call but not one of the above, return 404 or let it fall through?
    // Since this file is [[path]].js inside /api/, it catches everything under /api/
    return new Response('API Route Not Found', { status: 404 });
  }

  // Create new request
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(newRequest);
    return response;
  } catch (e) {
    return new Response(`Proxy Error: ${e.message}`, { status: 500 });
  }
}
