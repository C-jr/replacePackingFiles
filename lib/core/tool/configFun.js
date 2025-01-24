#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const pathStr = "../../../pathInfo.json";
// const pathStr = "../../../test.json";
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

//根据id和remark查询配置详情
const handleSearchDetail = (id, remark) => {
  if (typeof id !== "string") return false;
  //此次循环的文件内容没有拿到最新，可能要退出此次程序再重新查询才行
  const pathInfo = require(pathStr);
  console.log('Detail:',{pathInfo});
  const filterInfo = pathInfo.filter(
    (item) => item.id === id && item.remark === remark
  );  
  return dataFun.showTitleWidthKey(filterInfo[0]) 
};

function handleEdit(id,  key, upValue) {
  return new Promise((resolve, reject) => {
    let pathInfo = require(pathStr), newInfo = {};
    pathInfo = pathInfo.map((item) => {
      if (item.id === id) {
        //有值则更改，没值用原来的数据
        const newValue = upValue ? upValue : item[key];
        newInfo = { ...item, [key]: newValue };

        return newInfo;
      }
      return item;
    })
    // console.log({ pathInfo });
    handleUpdate(pathInfo);
    resolve(newInfo)
    // handleUpdate(pathInfo);
  })
 
}

module.exports = { handleAdd, handleSearch, handleDelete,handleSearchDetail ,handleEdit};
