"use strict";

const TodoMainUseCaseError = require("./todo-main-use-case-error.js");
const ITEM_ERROR_PREFIX = `${TodoMainUseCaseError.ERROR_PREFIX}item/`;

const Create = {
  UC_CODE: `${ITEM_ERROR_PREFIX}create/`,
  ListDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDaoCreateFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = "Creating item by item DAO create failed.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  }
};

const Get = {
  UC_CODE: `${ITEM_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
  ItemDaoGetFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDaoGetFailed`;
      this.message = "Selecting item by item DAO get failed.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  }
};

const Update = {
  UC_CODE: `${ITEM_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
  ItemDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
  ItemDaoUpdateFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDaoUpdateFailed`;
      this.message = "Updating item by item DAO update failed.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },
  ItemIsNotInCorrectState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemIsNotInCorrectState`;
      this.message = "Item is not in correct state.";
    }
  },
};

const Delete = {
  UC_CODE: `${ITEM_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDaoDeleteFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Deleting item by item DAO delete failed.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },
  ItemIsNotInCorrectState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemIsNotInCorrectState`;
      this.message = "Item is not in correct state.";
    }
  }
};

const SetFinalState = {
  UC_CODE: `${ITEM_ERROR_PREFIX}setFinalState/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },  
  ItemDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
  ItemIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemIsNotInProperState`;
      this.message = "Item is not in proper state.";
    }
  },
  ItemDaoSetFinalStateFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemDaoSetFinalStateFailed`;
      this.message = "Setting state of item by item DAO setFinalState failed.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  }
};

const List = {
  UC_CODE: `${ITEM_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDaoListFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}itemDaoListFailed`;
      this.message = "Getting list of items by item DAO list failed.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  }
};

module.exports = {
  List,
  SetFinalState,
  Delete,
  Update,
  Get,
  Create
};
