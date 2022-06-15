"use strict";
const Path = require("path");
const { start } = require("repl");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  listDoesNotExist: {
    code: `${Errors.Update.UC_CODE}listDoesNotExist`
  }
};

const EXECUTIVES_PROFILE = "Authorities";
class ListAbl {

  constructor() {
    this.validator = Validator.load();

    this.dao = DaoFactory.getDao("list");
    this.dao.createSchema();
  }

  async list(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn, 
    validationResult,
    WARNINGS.getUnsupportedKeys.code, 
    Errors.List.InvalidDtoIn
    );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();

    //HDS2
    //TODO

    //HDS 3
    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.listByVisibility(awid, true, dtoIn.pageIndex, dtoIn.pageSize);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.List.ListDaoListFailed({uuAppErrorMap}, e);
      }
      throw e;
    }
     //HDS 4
     dtoOut.uuAppErrorMap = uuAppErrorMap;
     return dtoOut;
    
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("toDoDeleteList", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn, 
    validationResult,
    WARNINGS.getUnsupportedKeys.code, 
    Errors.Delete.InvalidDtoIn
    );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    
    //HDS 3
    //TODO
    // let dtoOut;
    // try {
    //   dtoOut = await this.dao.getListById(dtoIn.id);
    //   if(dtoOut.itemList.length === 0) {
    //     uuAppErrorMap[WARNINGS.listDoesNotExist.code] = {
    //       id: dtoIn.id,
    //         type: "warning",
    //         message: "List with given id does not exist."
    //     }
    //   }
    // } catch (e){
    //   if (e instanceof ObjectStoreError) {
    //     throw new Errors.Get.ListDaoGetFailed({uuAppErrorMap}, e);
    //   }
    //   throw e;
    // }
  }

  async update(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("toDoUpdateList", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn, 
    validationResult,
    WARNINGS.deleteUnsupportedKeys.code, 
    Errors.Update.InvalidDtoIn
    );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName(); 

    //HDS 2
    //TODO

    //HDS 3
    let dateIn = new Date(dtoIn.deadline);
    let dateMilliseconds = dateIn.getTime();
    if(dateMilliseconds < Date.now()) {
      throw new Errors.Update.DeadlineDateIsFromThePast({uuAppErrorMap});
    }

    //HDS 4
    //TODO awid
    dtoIn.awid = awid;
    let dtoOut;
    try {
      let tmpList = await this.dao.getListById(dtoIn.id);
      if(tmpList.itemList.length === 0) {
        uuAppErrorMap[Errors.Get.ListDoesNotExist.code] = {
          id: dtoIn.id,
          timestamp: (new Date()).toISOString(),
          type: "error",
          message: "List with given id does not exist." 
        }
      } else {
        if(dtoIn.name) {
          dtoOut = await this.dao.updateListName(dtoIn.id, dtoIn.name);
        }
        if(dtoIn.description) {
          dtoOut = await this.dao.updateListDescription(dtoIn.id, dtoIn.description);
        }
        if(dtoIn.deadline) {
          dtoOut = await this.dao.updateListDeadline(dtoIn.id, dtoIn.deadline);
        }
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.ListDaoUpdateFailed({uuAppErrorMap}, e);
      }
    }

    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async get(awid, dtoIn, session, authorizationResult) {
  //HDS 1, 1.1
  let validationResult = this.validator.validate("toDoGetList", dtoIn);
  //1.2, 1.3
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn, 
    validationResult,
    WARNINGS.getUnsupportedKeys.code, 
    Errors.Get.InvalidDtoIn
    );

  //Authorization
  dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

  dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
  dtoIn.uuIdentityName = session.getIdentity().getName(); 

  //HDS 2
  //TODO

  //HDS 3
  let dtoOut;
  try {
    dtoOut = await this.dao.getListById(dtoIn.id);
    if(dtoOut.itemList.length === 0) {
      uuAppErrorMap[Errors.Get.ListDoesNotExist.code] = {
        id: dtoIn.id,
        timestamp: (new Date()).toISOString(),
          type: "error",
          message: "List with given id does not exist."
      }
    }
  } catch (e){
    if (e instanceof ObjectStoreError) {
      throw new Errors.Get.ListDaoGetFailed({uuAppErrorMap}, e);
    }
    throw e;
  }
  //HDS 4
  dtoOut.uuAppErrorMap = uuAppErrorMap;
  return dtoOut;
  }

  async create(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("toDoCreateList", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn, 
      validationResult,
      WARNINGS.createUnsupportedKeys.code, 
      Errors.Create.InvalidDtoIn
      );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName(); 

    //HDS 2
    //TODO

    //HDS 3
    let dateIn = new Date(dtoIn.deadline);
    let dateMilliseconds = dateIn.getTime();
    if(dateMilliseconds < Date.now()) {
      throw new Errors.Create.DeadlineDateIsFromThePast({uuAppErrorMap});
    }

    //HDS 4
    //TODO awid
    let dtoOut;
    try {
      dtoOut = await this.dao.createList(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.ListDaoCreateFailed({uuAppErrorMap}, e);
      }
    }

    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ListAbl();
