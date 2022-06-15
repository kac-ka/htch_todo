"use strict";

const TodoMainUseCaseError = require("./todo-main-use-case-error.js");
const LIST_ERROR_PREFIX = `${TodoMainUseCaseError.ERROR_PREFIX}list/`;

const Create = {
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  listDaoCreateFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "Creating list by list DAO create failed.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  deadlineDateIsFromThePast: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "Deadline date is from the past and therefore cannot be met.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  todoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "TodoInstance does not exist.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  todoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "The application is not in proper state.";
    }
  }        
};

module.exports = {
  Create
};
