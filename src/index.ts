import inquirer from 'inquirer';
import process from 'process';
// import path from 'path';
// import fs from 'fs';
// import YAML from 'yamljs';

import longest = require('longest');
import commitTypes = require('conventional-commit-types');
import commitizen = require('commitizen');
import gitconfig = require('gitconfig');

const configLoader = commitizen.configLoader;

var config = configLoader.load() || {};

var length = longest(Object.keys(commitTypes.types)).length + 1;

const types = Object.entries(commitTypes.types)
  .map(([key, value]) => {
    return {
      name: (key + ':').padEnd(length) + ' ' + value.description,
      value: key
    }
  });

// const dir: string = process.cwd();
//
// const fileName = '.cz.yml';

// const configFile = path.join(dir, fileName);
//
// const load = YAML.load(configFile);

// fs.readFileSync(configFile)

type STEP = ''

const options = {
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultIssue: process.env.CZ_ISSUE || config.defaultIssue,

};


export const prompter = async (cz: any, commit: (msg: string) => void) => {
  const username = await gitconfig.get({location: 'global'}).then((config) => config.user.name);

  inquirer
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
    .then(anwser => {
      commit(`[${username}] #${anwser.issue} ${anwser.type}: ${anwser.body}`);
    })
};




