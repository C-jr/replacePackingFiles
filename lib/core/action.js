const inquirer = require("inquirer");
const configInfo = require("../../config.js");
const initReplace = require("./tool/replaceFile.js");
const configFun = require("./tool/configFun.js");
const dataFun = require("./tool/dataFun.js");
const PathInfoArr = configInfo.pathInfo;
//所有环境
const allEnvArr = ["dev", "test", "prd"];

//替换文件
const replaceFileByEnv = (env) => {
  console.log("输入的环境为：", env);
  const envInfoArr = PathInfoArr.filter((item) => {
    return item.env === env;
  });
  if (!envInfoArr.length) {
    const envArr = [...new Set(PathInfoArr.map((item) => item.env))];
    console.log("没有找到对应环境的配置信息!环境可输入:", envArr.join("、"));
    process.exit();
  }
  const selectArr = envInfoArr.map((item) => item.remark);
  inquirer
    .prompt([
      {
        // 数组中每一个对象表示一个问题
        type: "list", // 问题类型，list表示选择列表
        name: "projectName", // 用于接收答案的键值
        choices: selectArr, // 选项
        message: "请选择需要替换的项目：", // 问题
      },
    ])
    .then((answer) => {
      const projectName = answer.projectName;
      console.log("您已选择：", projectName);
      const { source, dest } = PathInfoArr.find(
        (item) => item.remark === projectName
      );
      console.log("对应路径为:", dataFun.showTitle({ source, dest }));
      initReplace(source, dest);
    });
};

//替换文件-根据具体项目名
const replaceFileByPN = (pId) => {
  const infoItem = PathInfoArr.find((item) => {
    return item.id === pId;
  });
  if (!infoItem) {
    const idArr = [...new Set(PathInfoArr.map((item) => item.id))];
    console.log("没有找到对应环境的配置信息!对应项目可输入:", idArr.join("、"));
    process.exit();
  }
  const { source, dest } = infoItem;
  console.log("替换路径为:", dataFun.showTitle({ source, dest }));
  initReplace(source, dest);
};

/*添加配置*/
const setId = () => {
  return inquirer
    .prompt([
      {
        // 数组中每一个对象表示一个问题
        type: "input", // 输入
        name: "id", // 用于接收答案的键值
        message: "请为该配置命名：", // 问题
      },
    ])
    .then((answer) => {
      const inputId = answer.id;
      if (PathInfoArr.find((item) => item.id === inputId)) {
        console.log("该配置已存在，请重新输入！");
        return setId();
      } else {
        return inputId;
      }
    });
};
const addConfig = () => {
  let obj = {
    id: "",
    source: "",
    dest: "",
    remark: "",
    env: "",
  };
  setId()
    .then((id) => {
      obj.id = id;
      return inquirer.prompt([
        {
          // 数组中每一个对象表示一个问题
          type: "list", // 输入
          choices: allEnvArr, // 选项
          name: "env", // 用于接收答案的键值
          message: "请选择环境：", // 问题
        },
        {
          // 数组中每一个对象表示一个问题
          type: "input", // 输入
          name: "source", // 用于接收答案的键值
          message: "请填写源文件路径（如：C:\\MyProject\\build）：", // 问题
        },
        {
          // 数组中每一个对象表示一个问题
          type: "input", // 输入
          name: "dest", // 用于接收答案的键值
          message: "请填写目标文件路径（如：C:\\MyProject\\widget", // 问题
        },
        {
          // 数组中每一个对象表示一个问题
          type: "input", // 输入
          name: "remark", // 用于接收答案的键值
          message: "请填写配置描述（如：XX项目【练习dev】）：", // 问题
        },
      ]);
    })
    .then((answer) => {
      console.log("添加成功");
      obj = { ...obj, ...answer };
      configFun.handleAdd(obj);
      process.exit(1);
    });
};

//查询配置项
const searchConfig = () => {
  const info = configFun.handleSearch();
  console.log("查询结果：\n", info);
  process.exit(1);
};

//删除配置
const deleteConfig = () => {
  const infoArr = PathInfoArr.map((item) => `${item.id} -> ${item.remark}`);
  inquirer
    .prompt([
      {
        // 数组中每一个对象表示一个问题
        type: "list", // 输入
        name: "idStr", // 用于接收答案的键值
        choices: infoArr, // 选项
        message: "请选择需要删除的配置项：", // 问题
      },
    ])
    .then((answer) => {
      console.log("del", answer);
      const strArr = answer.idStr.split(" -> ");
      const id = strArr[0];
      const remark = strArr[1];
      console.log("您已选择：", id, remark);
      configFun.handleDelete(id, remark);
      console.log("handleDelete", id);
    });
};
module.exports = {
  replaceFileByEnv,
  replaceFileByPN,
  addConfig,
  searchConfig,
  deleteConfig,
};
