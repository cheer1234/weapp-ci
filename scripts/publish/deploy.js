/* eslint-disable @typescript-eslint/no-var-requires */
const { Command } = require('commander');
const execSync = require('child_process').execSync;

const program = new Command();
const mpCI = require('./ci.js');
const { sendMsg } = require('./webhook');
const [, , , ENV] = process.argv;

program
  .command('preview')
  .option('-s, --send', 'preview & robot send qrcode')
  .description('output the test qrcode')
  .action(async (cmd) => {
    try {
      execSync('npm i');
      console.log('npm i执行完毕');

      await mpCI.packNpm();
      console.log('npm构建完毕');

      await mpCI.preview();
      console.log('preview success');

      if (cmd.send) sendMsg();
    } catch (error) {
      console.error('preview fail', error);
    }
  });

program
  .command('upload')
  .option('-d, --description [description]', 'upload description')
  .option('-t, --tag [description]', 'upload tag')
  .description('upload the package')
  .action(async (cmd) => {
    try {
      execSync('npm i');
      console.log('npm install执行完毕');

      execSync(`npm run ${ENV}`);
      console.log(`环境已配置到: ${ENV}`);

      await mpCI.packNpm();
      console.log('npm构建完毕');

      await mpCI.upload(ENV);
    } catch (error) {
      console.error('upload fail', error);
    }
  });

program.command('packNpm').action(async () => {
  try {
    await myCI.packNpm();
  } catch (error) {
    console.error('packNpm fail', error);
  }
});

program.parse(process.argv);
