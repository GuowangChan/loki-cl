#! /usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const program = new Command();

// 定义命令和参数
program
  .command('create <app-name>')
  .description('create a new project')
  .action((name, options) => {
    require('../lib/create')(name, options)
  });

// 配置版本号信息
program
  .version(`v${require(path.resolve(__dirname, '../package.json')).version}`)
  .usage('<command> [option]');

// bin/cli.js

program
  // 监听 --help 执行
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('loki-cli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`lk <command> --help`)} for detailed usage of given command\r\n`)
  })

// 解析用户执行命令传入参数
program.parse(process.argv);