/* eslint-disable @typescript-eslint/no-var-requires */
const execSync = require('child_process').execSync;
const Dayjs = require('dayjs');

const author = execSync('git log --pretty=format:"%an" -n 1').toString().trim();
const commitMsg = execSync('git log --pretty=format:"%s" -n 1')
  .toString()
  .trim();
const branchName = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const msgTemplate = () => {
  const isExperience = false;
  const uploadType = isExperience ? '体验版' : '开发版';
  const TEMPLATE = `
      # ${uploadType}小程序构建完成
      ---
      构建时间: ${new Dayjs().format('MM-DD HH:mm')}
      author: ${author}
      commitMsg: ${commitMsg}
      branchName: ${branchName}
      ---
      ## ${uploadType} ${isExperience ? '' : '(有效期半小时)'}
      `;

  return TEMPLATE;
};

module.exports = { author, commitMsg, branchName, msgTemplate };
