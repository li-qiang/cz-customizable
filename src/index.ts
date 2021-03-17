import process from 'process';
import {Answer, Inquirer} from "inquirer";
import longest = require('longest');
import commitTypes = require('conventional-commit-types');
import commitizen = require('commitizen');
import gitconfig = require('gitconfig');

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
  defaultIssue: process.env.CZ_ISSUE || config.defaultIssue,
  emailDomain: config.emailDomain,

};


const validateEmail = (email: string) => {
  let regExp = RegExp(`.*?@${options.emailDomain}`)
  if (!regExp.test(email)) {
    console.error("invalid email:", email);
    process.exit(1)
  }
}

function cacheAnswer(answer: Answer) {
  config.defaultIssue = answer.issue;
  config.defaultType = answer.type;
  const homedir = require('os').homedir();
  fs.writeFile(`${homedir}/.czrc`, JSON.stringify(config), () => {})
}

export const prompter = async (cz: Inquirer, commit: (msg: string) => void) => {
  const user = await gitconfig.get({location: 'global'}).then((config) => config.user);

  cz
    .prompt([{
      name: 'issue',
      type: 'input',
      message: 'Input jira issue key:',
      default: options.defaultIssue
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
      cacheAnswer(answer);
      commit(`[${user.name}] #${answer.issue} ${answer.type}: ${answer.body}`);
    })
};




