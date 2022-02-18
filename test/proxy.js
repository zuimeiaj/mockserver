const http = require("http");

http
  .createServer((req, res) => {
    res.statusCode = 200;
    console.log("proxy...");
    res.write(JSON.stringify({ code: 200, data: "proxy" }));
    res.end();
  })
  .listen(9000);
