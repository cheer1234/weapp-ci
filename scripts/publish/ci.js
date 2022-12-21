/* eslint-disable @typescript-eslint/no-var-requires */
const ci = require("miniprogram-ci");
let projectPath = process.cwd();
let { version, description } = require(`${projectPath}/package.json`);
let { appid, setting } = require(`${projectPath}/project.config.json`);
const { author = "", commitMsg = "" } = require("./git-info.js");

const robotMap = {
  dev: 1,
  beta: 2,
  prod: 3,
};

const project = new ci.Project({
  appid,
  type: "miniProgram",
  projectPath,
  privateKeyPath: `${projectPath}/private.${appid}.key`,
  ignores: ["node_modules/**/*"],
});

const mpCI = {
  packNpm: async () => {
    try {
      const warning = await ci.packNpmManually({
        packageJsonPath: "./package.json",
        miniprogramNpmDistDir: "./src/",
      });
      console.warn("warning: ", warning);
    } catch (error) {
      console.error("oooooooooops 构建npm失败了=========\n", error);
    }
  },
  upload: async (ENV = 1) => {
    try {
      return await ci.upload({
        project,
        version,
        desc: `${ENV} - ${commitMsg} - @${author}`,
        setting: {
          ...setting,
          es7: true,
          minify: true,
          ignoreUploadUnusedFiles: true,
        },
        robot: robotMap[ENV], // 指定🤖
        // onProgressUpdate: console.log,
      });
    } catch (error) {
      console.error("oooooooooops  上传失败了=========\n", error);
    }
  },
  preview: async () => {
    try {
      return await ci.preview({
        project,
        desc: description,
        setting: {
          ...setting,
          es7: true,
          minify: true,
          ignoreUploadUnusedFiles: true,
        },
        qrcodeFormat: "image",
        qrcodeOutputDest: `${projectPath}/qrcode.jpg`,
        // onProgressUpdate: console.log,
      });
    } catch (error) {
      console.error("oooooooooops 生成二维码失败了========= \n", error);
    }
  },
};

module.exports = mpCI;
