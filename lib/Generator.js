const { getRepoList } = require('./http');
const ora = require('ora');
const inquirer = require('inquirer');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const path = require('path');
const chalk = require('chalk');

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.stop();
    return result;
  } catch (error) {
    spinner.fail('Request Failed...' + error)
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repoList) return;
    let repos = repoList.map(item => item.name)
    console.log(repos)
    if (repos.length < 1) return;
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择项目模板'
    })
    return repo;
  }

  async download(repo) {
    const requestUrl = `direct:https://github.com/loki-cli/${repo}#main`;
    await wrapLoading(
      this.downloadGitRepo,
      'wait download template',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir),
      { clone: true }
    )
  }

  async create() {
    const repo = await this.getRepo();
    await this.download(repo);
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}
module.exports = Generator;