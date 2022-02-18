const { createServer } = require("./libs/server");

module.exports = (config) => {
  return createServer(config);
};
