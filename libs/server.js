const mockjs = require("mockjs");
const http = require("http");
const defaults = require("./defaults");

const proxy = require("http-proxy");
const {
  resetRegexpRule,
  waitForSeconds,
  readMockData,
  getResult,
} = require("./util");

async function onRequest({ req, res, config, callback }) {
  try {
    const uri = req.url.replace(config.baseURL, "");
    const fileName = uri.split("/")[0] + ".json";
    // 在指定目录下，读取json文件
    const mockData = readMockData(config.mockDir, fileName);
    // 故意延时，看起来像是通过网络请求的
    await waitForSeconds(config.sleep());
    // 支持 POST DELETE PUT GET
    const result = getResult({ mockData, method: req.method, uri });
    if (result) {
      res.setHeader("Content-Type", config.contentType);
      res.statusCode = 200;
      // 让json描述支持正则表达式，mockjs会根据正则反推出随机字符
      resetRegexpRule(result);
      // 返回模拟数据
      res.end(JSON.stringify(mockjs.mock(result)));
      console.log(`Response ${req.url}`);
    } else {
      config.callback ? config.callback(req, res) : callback();
    }
  } catch (e) {
    res.end(JSON.stringify({ error: e.message }));
  }
}

function getProxyTarget(url, config) {
  // 直接配置目标服务地址
  if (config.target) {
    return config;
  }

  // 可根据前缀匹配目标服务
  const prefix = Object.keys(config).find((prefix) => {
    return url.startsWith(prefix);
  });

  return config[prefix];
}

function rewritePath(req, config) {
  if (config.pathRewrite) {
    for (let key in config.pathRewrite) {
      let original = req.url;
      req.url = req.url.replace(new RegExp(key), config.pathRewrite[key]);
      console.log("path rewrite:", original, "=>", req.url);
    }
  }
}

module.exports = {
  createServer: (config = {}) => {
    const proxyServer = proxy.createProxyServer({});
    const server = http.createServer((req, res) =>
      onRequest({
        req,
        res,
        config: { ...defaults, ...config },
        callback: () => {
          //没有找到mock数据，继续请求服务
          const target = getProxyTarget(req.url, config.proxy);
          if (target) {
            rewritePath(req, target);
            console.log("proxy to:", target.target + req.url);
            proxyServer.web(req, res, target);
          } else
            res.end(
              JSON.stringify({
                code: 200,
                data: "Not implemented",
                url: req.url,
              })
            );
        },
      })
    );
    server.listen(config.port);
    console.log(`Mock server running at ${config.port}`);
    return server;
  },
};
