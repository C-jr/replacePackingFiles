const titleObj = {
  id: "配置名",
  source: "源路径",
  dest: "替换路径",
  remark: "配置备注",
  env: "配置环境",
};

/**显示标题中文
 *
 * @param {*} obj 单个配置项
 * @returns obj 更改完key的对象
 */
const showTitle = (obj) => {
  const changeObj = {};
  for (let key in obj) {
    const name = titleObj[key] || key;
    changeObj[name] = obj[key];
  }
  return changeObj;
};

module.exports = { titleObj, showTitle };
