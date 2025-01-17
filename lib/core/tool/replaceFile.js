#!/usr/bin/env node
const READ_LINE = require("readline");
const fs = require("fs");
const path = require("path");

//创建终端读取实例
const readline = READ_LINE.createInterface({
  input: process.stdin, //要监听的可读流 (必需).
  output: process.stdout, //要写入 readline 的可写流 (必须).
});

//初始化-准备替换文件的条件
const initReplace = (sPath, dPath) => {
  try {
    //检查路径是否存在
    if (!fs.existsSync(sPath)) {
      createFolder(sPath);
    }
    if (!fs.existsSync(dPath)) {
      createFolder(dPath);
    }
    //开始替换文件
    fileReplace(sPath, dPath)
      .catch((err) => {
        process.stderr.write("错误提示：" + err);
        process.exit(1);
      })
      .finally(() => {
        readline.close();
      });
  } catch (error) {
    readline.close();
  }
};

//对于目标路径不存在的，自动创建
const createFolder = (dirPath) => {
  try {
    const dirArr = dirPath.split("\\");
    for (let i = 0; i < dirArr.length; i++) {
      const pathStr = dirArr.slice(0, i + 1).join("\\");
      console.log({ pathStr });
      if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr);
      }
    }
    console.log("创建文件夹路径-成功：", dirPath);
  } catch (err) {
    console.log("创建文件夹路径-失败：", dirPath);
    console.log(err);
  }
};

/**获取该文件的信息
 *
 * @param {*} dirPath 路径
 * @param {*} fileName 文件名
 * @returns {Object} 传入的参数，拼接后的完整路径，是否为目录...
 */
const getFileInfo = (dirPath, fileName) => {
  const fullPath = path.join(dirPath, fileName);
  const stat = fs.statSync(fullPath);
  return {
    dirPath,
    fileName,
    fullPath,
    stat,
    isDirectory: stat.isDirectory(),
  };
};

/**在指定目录查找文件，并返回该文件的完整路径
 *
 * @param {*} dirPath 目标地址
 * @param {*} destFloderName 目标文件名
 * @param {*} destIsDirectory 目标文件是否为文件夹
 * @returns
 */
const getFileFullPath = (dirPath, destFloderName, destIsDirectory) => {
  const files = fs.readdirSync(dirPath);
  let fullName = "";
  for (let file of files) {
    const { isDirectory, fullPath } = getFileInfo(dirPath, file);
    if (isDirectory === destIsDirectory && file === destFloderName) {
      fullName = fullPath;
      break;
    } else if (isDirectory) {
      getFileFullPath(fullPath, destFloderName, destIsDirectory);
    } else {
      continue;
    }
  }
  return fullName;
};

/**删除文件夹
 *
 * @param {*} folderPath 要删除的文件路径
 * @param {*} isDirectory 是否为目录
 * @returns
 */
const deleteFolder = (folderPath, isDirectory) => {
  if (!fs.existsSync(folderPath)) return console.log("文件夹不存在，无需删除");

  if (!isDirectory) {
    return fs.unlinkSync(folderPath);
  }
  const files = fs.readdirSync(folderPath);
  for (let file of files) {
    const { isDirectory, fullPath } = getFileInfo(folderPath, file);
    if (isDirectory) {
      deleteFolder(fullPath, isDirectory);
    } else {
      try {
        fs.unlinkSync(fullPath);
        // console.log("文件删除成功：", file);
      } catch (err) {
        console.error("文件删除出错：", file);
        console.error(err);
      }
    }
  }
  try {
    //仅可用于删除空文件夹
    fs.rmdirSync(folderPath);
    // console.log("成功删除空文件夹：", folderPath);
  } catch (err) {
    console.error("删除空文件夹出错：", err);
  }
};

/** 复制文件
 *
 * @param {*} sPath 源路径
 * @param {*} dPath 目标路径
 * @param {*} isDirectory 是否为目录
 * @returns
 */
const copyFolder = (sPath, dPath, isDirectory) => {
  if (!isDirectory) {
    return fs.copyFileSync(sPath, dPath);
  }

  if (!fs.existsSync(dPath)) fs.mkdirSync(dPath);
  const files = fs.readdirSync(sPath);
  for (let file of files) {
    const { isDirectory, fullPath } = getFileInfo(sPath, file);
    if (isDirectory) {
      const dFullPath = path.join(dPath, file);
      copyFolder(fullPath, dFullPath, isDirectory);
    } else {
      try {
        const dFullPath = path.join(dPath, file);
        fs.copyFileSync(fullPath, dFullPath);
        // console.log("文件复制成功：", file);
      } catch (err) {
        console.error("文件复制失败：", file);
        console.error(err);
      }
    }
  }
};

/**文件替换
 *
 * @param {*} sPath 源路径
 * @param {*} dPath 目标路径
 * @param {*} isSpecific 是否替换具体的文件：true-深层(具体到单个文件)，false-表层(可能整个文件夹替换)
 */
const fileReplace = (sPath, dPath) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(sPath);
    console.log("开始替换文件：");
    // console.log({ sourcePath: sPath, destPath: dPath });
    for (let file of files) {
      const { isDirectory, fullPath } = getFileInfo(sPath, file);
      const destFullPath = path.join(dPath, file);
      console.log("正在替换:" + file);
      try {
        deleteFolder(destFullPath, isDirectory);
        copyFolder(fullPath, destFullPath, isDirectory);
        console.log("success：", file);
      } catch (e) {
        console.log("err：", e);
      }
    }
    resolve(true);
  });
};

//终端交互询问-废弃，已换成自定义指令交互
const whichEnv2Replace = (pathInfo) => {
  const pathArr = Object.keys(pathInfo);
  console.log("文件替换可用的路径有：");
  const getInfo = (num) => {
    const key = pathArr[num];
    return pathInfo[key];
  };
  for (let i = 0, len = pathArr.length; i < len; i++) {
    const { remark } = getInfo(i);
    console.log(`${i + 1}.${remark || ""}`);
  }
  //监听输入事件
  readline.question("请输入对应【数字】选择环境：", (typeNum) => {
    const index = typeNum - 1;
    const info = getInfo(index);
    if (info) {
      const { source, dest, remark } = info;
      console.log(`\n您已选择【${remark}】\n文件替换路径为：`);
      console.log({ source, dest });
      initReplace(source, dest);
    } else {
      console.log("没有找到命令!");
      readline.close();
    }
  });
};

// whichEnv2Replace();
// close事件监听
readline.on("close", function () {
  process.exit(0); // 结束程序
});

module.exports = initReplace;
