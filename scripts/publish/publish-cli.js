/* eslint-disable @typescript-eslint/no-var-requires */
const { prompt } = require("inquirer");
const execSync = require("child_process").execSync;

const mpCI = require("./ci.js");
const fs = require("fs");

let projectPath = process.cwd();
let pkg = require(`${projectPath}/package.json`);
const { sendMsg } = require("./webhook");

(() => {
  prompt([
    {
      name: "version",
      type: "input",
      message: "请输入预发布版本号",
      default: pkg.version,
    },
    {
      name: "send",
      type: "confirm",
      message: "是否要推送到企微群",
      default: false,
    },
    {
      name: "upload",
      type: "confirm",
      message: "是否要上传到小程序后台",
      default: false,
    },
  ])
    .then((answers) => {
      console.info("Answer:", { answers });

      const ENV = "prod";

      fs.writeFile(
        `${projectPath}/package.json`,
        JSON.stringify(
          Object.assign({}, pkg, { version: answers.version }),
          null,
          2
        ),
        async (err) => {
          if (err) throw err;
          console.log("The file has been saved!");

          execSync("npm i");
          console.log("npm i —— 完成");

          execSync(`npm run ${ENV}`);
          console.log(`npm run ${ENV} —— 完成`);

          await mpCI.packNpm();
          console.log("npm 构建完成");

          if (!!answers.send) {
            await mpCI.preview();
            sendMsg();
          }

          if (!!answers.upload) await mpCI.upload(ENV);
        }
      );
    })
    .catch((error) => {
      console.error("error", error);
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
})();
