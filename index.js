const { createServer } = require("./libs/server");

/**
 * 创建mock服务，数据生成格式基于mockjs。另外可以直接在 json对象key中写 正则表达式，格式为 "key|regex":"字符串regex"
 * @param {object} config
 * @param {string} [config.baseURL] - 在匹配数据源时会从实际url中去除baseURL. 例如：/api/user/list，baseURL为 /api/ => 查询数据时为 user/list
 * @param {number} [config.port] - 模拟数据服务端口，默认为8510
 * @param {object} [config.proxy] - 代理服务配置,基于http-proxy，支持前缀map配置。和直接配置
 * @param {string} config.mockDir - 模拟数据源目录,会在该目录下匹配数据源
 * @param {Function} [config.sleep] - 模拟请求延时时间，默认返回0.1秒
 * @param {string} [config.contentType] - 返回数据格式，默认为'application/json;utf-8'
 * @example
 *  proxy 配置
 *  支持方式1：支持前缀匹配
 *    proxy:{
 *      "/api/server1":{
 *          "target":"server1"
 *      },
 *      "/api/server2":{
 *          "target":"server2"
 *      }
 *    }
 *  支持方式2：直接配置target对象
 *  proxy:{
 *    target:"server"
 *  }
 *  支持pathRewrite:
 *  {
 *      target:"server1",
 *      pathRewrite:{
 *        "^/foo":"/bar"
 *      }
 *  }
 *
 * mock json数据格式
 *
 * 请求：user/list
 * 匹配：mockDir/user.json ,格式如下
 *  {
 *  "get:user/list":{
 *      "code":200,
 *      "data|20":[
 *        {
 *          "name":"@cname"
 *        }
 *      ]
 *  }
 * }
 *
 *
 * @returns  http.Server
 */
module.exports = (config) => {
  return createServer(config);
};
