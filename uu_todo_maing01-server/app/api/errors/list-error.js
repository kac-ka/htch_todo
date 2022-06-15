"use strict";

const TodoMainUseCaseError = require("./todo-main-use-case-error.js");
const LIST_ERROR_PREFIX = `${TodoMainUseCaseError.ERROR_PREFIX}list/`;

const Create = {
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  
};

module.exports = {
  Create
};
