const http = require("http");
const mockServer = require("../index");
const path = require("path");
const server = mockServer({
  port: 8890,
  baseURL: "/api/",
  mockDir: path.resolve(__dirname, "../mock"),
  proxy: {
    timeout: 1000,
    target: "https://baidu.com",
    pathRewrite: {
      "^/api": "",
    },
  },
});

function getResult(res) {
  return new Promise((resolve) => {
    let datas = "";
    res.setEncoding("utf-8");
    res.on("data", (data) => {
      datas += data;
    });
    res.on("end", () => {
      resolve(JSON.parse(datas));
    });
  });
}

function request(path) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        method: "POST",
        port: 8890,
        host: "127.0.0.1",
        path,
      },
      async (res) => {
        const result = await getResult(res);
        resolve(result);
      }
    );
    req.write("{}");
    req.end();
  });
}

async function execTestApi() {
  let res = await request("/api/user/login");
  console.assert(res.code === 200, "error:user/login");
  res = await request("/api/user/info");
  console.assert(res.data.name === "Jack", "error:user/info");
  // 没有模拟数据将继续请求
  res = await request("/api/s?wd=hello");
  // proxy
  console.log(res);
  console.assert(res.data.repCode === "0000", "error:empty");
  server.close();
}

execTestApi();
