const path = require("path");
const pathStr = "pathInfo.json";
// const pathStr = "./test.json";
module.exports = {
  //路径信息
  pathInfo: () => require(path.resolve(__dirname, pathStr)),
};
