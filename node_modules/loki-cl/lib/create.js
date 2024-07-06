const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./Generator')

module.exports = async function (name, options) {
  const cwd = process.cwd();

  const targetAir = path.join(cwd, name);

  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目录已经存在,是否覆盖？',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite'
            },
            {
              name: '取消',
              value: false
            }
          ]
        }
      ])
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }
  const generator = new Generator(name, targetAir);

  generator.create();
}