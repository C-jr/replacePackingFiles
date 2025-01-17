#!/usr/bin/env node
// 告诉操作系统用 Node 来运行此文件
// 在本项目的根目录里执行 npm link ，将./bin下面的myGlobal命令挂载到全局
// npm install commander
const program = require("commander");

const myhelp = require("../lib/core/help");
const myCommander = require("../lib/core/commander");

myhelp(program);
myCommander.replaceByEnv(program);
myCommander.replaceByProject(program);
myCommander.handleConfig(program);
myCommander.handleSearchConfig(program);
myCommander.handleSearchConfig(program);
myCommander.handleDeleteConfig(program);

program.parse(process.argv);
