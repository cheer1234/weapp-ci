/* eslint-disable @typescript-eslint/no-var-requires */
const { prompt } = require("inquirer");
const execSync = require("child_process").execSync;
const mpCI = require("./ci.js");

(() => {
  prompt([
    {
      name: "env",
      type: "list",
      message: "请选择要构建的版本",
      choices: ["dev", "beta", "prod"],
      default: "dev",
    },
  ])
    .then(async (answers) => {
      execSync("npm i");
      console.log("npm i —— 完成");

      execSync(`npm run ${answers.env}`);
      console.log(`npm run ${answers.env} —— 完成`);

      await mpCI.packNpm();
      console.log("npm 构建完成");
    })
    .catch((error) => {
      console.error("error", error);
    });
})();
