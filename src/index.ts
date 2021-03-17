import process from 'process';
import longest = require('longest');
import commitTypes = require('conventional-commit-types');
import commitizen = require('commitizen');
import gitconfig = require('gitconfig');
import Inquirer = require('inquirer');
const fs = require('fs');

var config = commitizen.configLoader.load() || {};

var length = longest(Object.keys(commitTypes.types)).length + 1;

const types = Object.entries(commitTypes.types)
  .map(([key, value]) => {
    return {
      name: (key + ':').padEnd(length) + ' ' + value.description,
      value: key
    }
  });

const options = {
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultCardNo: process.env.CZ_CardNo || config.cardNo,
  emailDomain: config.emailDomain,

};


const validateEmail = (email: string) => {
  let regExp = RegExp(`.*?@${options.emailDomain}`)
  if (!regExp.test(email)) {
    console.error("invalid email:", email);
    process.exit(1)
  }
}

function cacheCardNo(cardNo: string) {
  config.cardNo = cardNo;
  const homedir = require('os').homedir();
  fs.writeFile(`${homedir}/.czrc`, JSON.stringify(config), () => {
  })
}

export const prompter = async (cz: Inquirer, commit: (msg: string) => void) => {
  const user = await gitconfig.get({location: 'global'}).then((config) => config.user);

  cz
    .prompt([{
      name: 'cardNo',
      type: 'input',
      message: 'Input jira issue key:',
      default: options.defaultCardNo
    }, {
      type: 'list',
      name: 'type',
      message: "Select the type of change that you're committing:",
      choices: types,
      default: options.defaultType
    }, {
      name: 'body',
      type: 'input',
      message: 'Input message content:',
    }])
    .then(answer => {
      validateEmail(user.email);
      cacheCardNo(answer.cardNo);
      commit(`[${user.name}] #${answer.cardNo} ${answer.type}: ${answer.body}`);
    })
};




