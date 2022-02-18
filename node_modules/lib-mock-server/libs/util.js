const path = require("path");
const fs = require("fs");
const regexpRule = /\s*\|\s*regexp\s*$/;
function resetRegexpRule(data) {
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      if (regexpRule.test(key)) {
        const newKey = key.replace(regexpRule, "");
        data[newKey] = new RegExp(data[key]);
        delete data[key];
      } else if (data[key] && typeof data[key] === "object") {
        resetRegexpRule(data[key]);
      } else if (Array.isArray(data[key])) {
        resetRegexpRule(data[key]);
      }
    });
  } else if (Array.isArray(data)) {
    data.forEach((item) => {
      resetRegexpRule(item);
    });
  }
}

async function waitForSeconds(s) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

function readMockData(dir, name) {
  const filename = path.resolve(dir, name);
  try {
    fs.accessSync(filename, fs.constants.F_OK);
  } catch (e) {
    return {};
  }
  const data = fs.readFileSync(filename, { encoding: "utf-8" });
  return JSON.parse(data);
}

function getResult({ mockData, method, uri }) {
  const resultKey = Object.keys(mockData).find((key) => {
    let reg = new RegExp("^" + key + "$");
    let fileKey = method.toLowerCase() + ":" + uri.split("?")[0];
    return reg.test(fileKey);
  });
  // 根据正则匹配
  const result = mockData[resultKey];
  return result;
}

module.exports = {
  resetRegexpRule,
  waitForSeconds,
  readMockData,
  getResult,
};
