const path = require("path");
const inquirer = require("inquirer");
const { pathInfo } = require("../../config.js");
const initReplace = require("./tool/replaceFile.js");
const configFun = require("./tool/configFun.js");
const dataFun = require("./tool/dataFun.js");
const PathInfoArr = pathInfo();


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
const setId = (isEdit) => {
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
        if (isEdit) {
          console.log("已有相同配置，不予更改！");
          return inputId
        }
          console.log("该配置已存在，请重新输入！");
          return setId(isEdit);
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
  setId(false)
    .then((id) => {
      obj.id = id;
      const questionInfo = Object.values(dataFun.questionInfo);
      return inquirer.prompt(questionInfo);
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
      console.log(id+"，删除成功！" );
    });
};

//修改配置
function editConfig() {
  const infoArr = PathInfoArr.map((item) => `${item.id} -> ${item.remark}`);
  let seltId = '', seltRemark = '', seltKey = '';
  inquirer
  .prompt([
    {
      // 数组中每一个对象表示一个问题
      type: "list", // 输入
      name: "idStr", // 用于接收答案的键值
      choices: infoArr, // 选项
      message: "请选择需要修改的配置项：", // 问题
    },
  ])
  .then((answer) => {
    const strArr = answer.idStr.split(" -> ");
    seltId = strArr[0];
    seltRemark = strArr[1];
    console.log("您已选择：", seltId, seltRemark);
    editDetail(seltId,seltRemark)
  });
};
function editDetail(seltId, seltRemark) {  
  console.log("editDetail", {seltId,seltRemark});
  const formatInfo = configFun.handleSearchDetail(seltId, seltRemark);
 
  if (formatInfo.length == 0) {
    console.log("没有找到对应环境的配置信息!");
    return process.exit(1);
  }
  console.log("最新详细信息如下：\n", formatInfo);
    return inquirer
  .prompt([
    {
      // 数组中每一个对象表示一个问题
      type: "list", // 输入
      name: "keyStr", // 用于接收答案的键值
      choices: formatInfo, // 选项
      message: "请选择需要修改的具体内容(空内容则不修改)：", // 问题
    },
  ]).then(answer => {
    seltKey = dataFun.getKeyOrGetStr(answer.keyStr)      
    // console.log("您已选择：", answer.keyStr);
    const question = dataFun.questionInfo[seltKey];
    return seltKey=="id"?setId(true):inquirer.prompt([question])
  }).then(answer => {
    const updateValue = seltKey == "id" ? answer : answer[seltKey];
    return configFun.handleEdit(seltId,seltKey,updateValue)    
  }).then(newInfo => {
    console.log("修改成功！可继续修改，也可ctr+c退出", newInfo);
    const {id,remark} = newInfo;    
    editDetail(id,remark)
  });
}

module.exports = {
  replaceFileByEnv,
  replaceFileByPN,
  addConfig,
  searchConfig,
  deleteConfig,
  editConfig,
};
