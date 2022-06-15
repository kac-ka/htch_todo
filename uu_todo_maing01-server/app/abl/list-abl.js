"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  }
};

const EXECUTIVES_PROFILE = "Authorities";
class ListAbl {

  constructor() {
    this.validator = Validator.load();

    this.dao = DaoFactory.getDao("list");
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
      throw new Errors.Create.deadlineDateIsFromThePast({uuAppErrorMap});
    }

    //HDS 4
    //TODO awid
    let dtoOut;
    try {
      dtoOut = await this.dao.createList(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.listDaoCreateFailed({uuAppErrorMap}, e);
      }
    }

    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

}

module.exports = new ListAbl();
