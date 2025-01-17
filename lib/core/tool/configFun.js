#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
// const pathStr = "../../../pathInfo.json";
const pathStr = "../../../test.json";
const dataFun = require("./dataFun.js");

//更新文件内容
const handleUpdate = (pathInfo) => {
  const pathFile = path.resolve(__dirname, pathStr);
  try {
    fs.writeFileSync(pathFile, JSON.stringify(pathInfo));
  } catch (err) {
    process.stderr.write("错误提示：" + err);
  }
};

//添加配置
const handleAdd = (obj) => {
  let pathInfo = require(pathStr);
  pathInfo.push(obj);
  // console.log({ pathInfo });
  handleUpdate(pathInfo);
};

//查询所有配置
const handleSearch = () => {
  const pathInfo = require(pathStr);
  const pathFile = pathInfo.map(dataFun.showTitle);
  // console.log(pathFile);
  return pathFile;
};

//删除配置
const handleDelete = (id, remark) => {
  if (typeof id !== "string") return false;
  const pathInfo = require(pathStr);
  const filterInfo = pathInfo.filter(
    (item) => item.id !== id && item.remark !== remark
  );
  handleUpdate(filterInfo);
};

module.exports = { handleAdd, handleSearch, handleDelete };
