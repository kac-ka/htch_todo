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
  ListDaoCreateFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Creating list by list DAO create failed.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  DeadlineDateIsFromThePast: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}deadlineDateIsFromThePast`;
      this.message = "Deadline date is from the past and therefore cannot be met.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  }        
};

const Get = {
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  ListDaoGetFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoGetFailed`;
      this.message = "Geting list by list DAO get failed.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,
  ListDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  }     
  
};

module.exports = {
  Get,
  Create
};
