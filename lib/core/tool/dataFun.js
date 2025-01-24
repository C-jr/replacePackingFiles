const titleObj = {
  id: "配置名",
  source: "源路径",
  dest: "替换路径",
  remark: "配置备注",
  env: "配置环境",
};
//所有环境
const allEnvArr = ["dev", "test", "prd"];
//问题对应的信息询问-不包含Id字段的配置信息
const questionInfo = {
  env:{
    // 数组中每一个对象表示一个问题
    type: "list", // 输入
    choices: allEnvArr, // 选项
    name: "env", // 用于接收答案的键值
    message: "请选择环境：", // 问题
  },
  source:{
    // 数组中每一个对象表示一个问题
    type: "input", // 输入
    name: "source", // 用于接收答案的键值
    message: "请填写源文件路径（如：C:\\MyProject\\build）：", // 问题
  },
  dest:{
    // 数组中每一个对象表示一个问题
    type: "input", // 输入
    name: "dest", // 用于接收答案的键值
    message: "请填写目标文件路径（如：C:\\MyProject\\widget", // 问题
  },
  remark:{
    // 数组中每一个对象表示一个问题
    type: "input", // 输入
    name: "remark", // 用于接收答案的键值
    message: "请填写配置描述（如：XX项目【练习dev】）：", // 问题
  },
}

/**显示标题中文
 *
 * @param {*} obj 单个配置项
 * @returns obj 更改完key的对象
 */
function showTitle(obj) {
  const changeObj = {};
  for (let key in obj) {
    const name = titleObj[key] || key;
    changeObj[name] = obj[key];
  }
  return changeObj;
};

/**显示标题中文和key
 * @param {*} info 单个配置项
 * @returns arr 更改完key的数组 
 */
function showTitleWidthKey(info){
  const arr = []
  for (let key in info) { 
    const str = getKeyOrGetStr({key: key, value: info[key] })
    arr.push(str)
  }
return arr
};

//获取key的字符串
function getKeyOrGetStr(info) { 
  if (typeof info === 'object') {
    const { key, value } = info
    const name = titleObj[key] || key;
    return key ? `${name}(${key}): ${value}` : ''
  } else if(typeof info === 'string') {
    return info?.match(/(?<=\().*?(?=\))/g)?.[0] ??''
  }else {
    return ''
  }
}


module.exports = { titleObj,allEnvArr, questionInfo,showTitle ,showTitleWidthKey,getKeyOrGetStr};
