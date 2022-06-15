"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  }
};
const EXECUTIVES_PROFILE = "Authorities";

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
    this.dao.createSchema();

    this.daoList = DaoFactory.getDao("list");
    this.daoList.createSchema();
  }

  async get(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
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

    let dtoOut;
    try {
      dtoOut = await this.dao.getItem(dtoIn.id);
      if (dtoOut.itemList.length === 0){
        //return new Errors.Create.ListDoesNotExist({uuAppErrorMap});
        return uuAppErrorMap[Errors.Get.ItemDoesNotExist.code] = {
          id: dtoIn.id,
          timestamp: (new Date()).toISOString(),
            type: "error",
            message: "Item with given id does not exist."
        }
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Get.ItemDaoGetFailed({uuAppErrorMap}, e);
      }
    }
    
    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async create(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
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

    let dtoOut;
    try {
      let tmpList = await this.daoList.getListById(dtoIn.listId);
      if (tmpList.itemList.length === 0){
        //return new Errors.Create.ListDoesNotExist({uuAppErrorMap});
        return uuAppErrorMap[Errors.Create.ListDoesNotExist.code] = {
          id: dtoIn.listId,
          timestamp: (new Date()).toISOString(),
            type: "error",
            message: "List with given id does not exist."
        }
      }
      else{
        dtoOut = await this.dao.createItem(dtoIn)
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.ItemDaoCreateFailed({uuAppErrorMap}, e);
      }
    }
    
    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

}

module.exports = new ItemAbl();
