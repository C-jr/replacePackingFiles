const {
  replaceFileByEnv,
  replaceFileByPN,
  addConfig,
  searchConfig,
  deleteConfig,
  editConfig,
} = require("./action.js");

const replaceByEnv = function (program) {
  program
    .command("replace <env>") // 自定义命令
    .alias("rep") // 别名
    .description("替换npm打包后的文件-根据环境名") // 描述
    .action(replaceFileByEnv);
};
const replaceByProject = function (program) {
  program
    .command("replaceByProject") // 自定义命令
    .alias("rpj") // 别名
    .description("替换npm打包后的文件-根据具体项目名") // 描述
    .action(replaceFileByPN);
};

//与终端交互，配置config
const handleConfig = function (program) {
  program
    .command("addConfig") // 自定义命令
    .alias("add") // 别名
    .description("给配置文件增加项") // 描述
    .action(addConfig);
};
//查询配置
const handleSearchConfig = function (program) {
  program
    .command("searchConfig") // 自定义命令
    .alias("search") // 别名
    .description("查询所有配置项") // 描述
    .action(searchConfig);
};
//删除配置
const handleDeleteConfig = function (program) {
  program
    .command("deleteConfig")
    .alias("delete")
    .description("删除配置项")
    .action(deleteConfig);
};
//修改配置
const handleEditConfig = function (program) {
  program
    .command("editConfig")
    .alias("edit")
    .description("修改配置项")
    .action(editConfig);
};

module.exports = {
  replaceByEnv,
  replaceByProject,
  handleConfig,
  handleSearchConfig,
  handleDeleteConfig,
  handleEditConfig,
};
