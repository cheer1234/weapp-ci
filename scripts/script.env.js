/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs"); //引入nodejs fs文件模块

const writeFile = (path, data) => {
  fs.writeFile(`${process.cwd()}${path}`, data, (err) => {
    if (err) throw err;
  });
};

const CONFIG = {
  dev: {
    title: "dev环境",
    baseURL: "",
  },
  beta: {
    title: "beta环境",
    baseURL: "",
  },
  prod: {
    title: "prod环境",
    baseURL: "",
  },
};

const env = process.env.NODE_ENV?.replace(/\'/g, "").replace(" ", ""); //当前执行环境
const ITEM = CONFIG[env];

let configString = "";
Object.keys(ITEM).forEach((key) => {
  configString += `export const ${key} = '${ITEM[key]}';\n`;
});
// 自动写入需要配置的config.js文件
writeFile("/scripts/config.ts", configString);
