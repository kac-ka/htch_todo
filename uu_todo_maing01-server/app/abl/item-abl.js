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
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
  deleteItemDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}itemDoesNotExist`
  },
  listDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}listDoesNotExist`
  },
  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`
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

  async setFinalState(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn, 
      validationResult,
      WARNINGS.setFinalStateUnsupportedKeys.code, 
      Errors.SetFinalState.InvalidDtoIn
      );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    
    let dtoOut;
    try {
      let tmpItem;
      try {
        tmpItem = await this.dao.getItem(dtoIn.id);
      } catch (error) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.Get.ItemDaoGetFailed({uuAppErrorMap}, e);
        }
      throw e;
      }
      if(tmpItem.itemList.length === 0) {
        uuAppErrorMap[Errors.SetFinalState.ItemDoesNotExist.code] = {
          id: dtoIn.id,
            type: "error",
            message: "Item with given id does not exist."
          }
        } else {
          if (tmpItem.itemList[0].state && tmpItem.itemList[0].state === "active"){
            dtoOut = await this.dao.SetItemFinalState(dtoIn.id, dtoIn.state);
          } else {
            throw new Errors.SetFinalState.ItemIsNotInProperState({uuAppErrorMap});
          }
        }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
          throw new Errors.SetFinalState.ItemDaoSetFinalStateFailed({uuAppErrorMap}, e);
        }
      throw e;
    }

     //HDS 5
     dtoOut.uuAppErrorMap = uuAppErrorMap;
     return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
     //HDS 1, 1.1
     let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
     //1.2, 1.3
     let uuAppErrorMap = ValidationHelper.processValidationResult(
       dtoIn, 
       validationResult,
       WARNINGS.deleteUnsupportedKeys.code, 
       Errors.Delete.InvalidDtoIn
       );
 
     //Authorization
     dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);
 
     dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
     dtoIn.uuIdentityName = session.getIdentity().getName(); 

     //HDS 3
     let dtoOut;
    try {
      dtoOut = await this.dao.getItem(dtoIn.id);
      if(dtoOut.itemList.length === 0) {
        uuAppErrorMap[WARNINGS.deleteItemDoesNotExist.code] = {
          id: dtoIn.id,
            type: "warning",
            message: "Item with given id does not exist."
          }
        } 
    } catch (e) {
      if (e instanceof ObjectStoreError) {
          throw new Errors.Delete.ItemDaoDeleteFailed({uuAppErrorMap}, e);
        }
      throw e;
    }

     //HDS 5
     dtoOut.uuAppErrorMap = uuAppErrorMap;
     return dtoOut;
   }

  async update(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn, 
      validationResult,
      WARNINGS.updateUnsupportedKeys.code, 
      Errors.Update.InvalidDtoIn
      );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName(); 

    let dtoOut;
    try {

      if (dtoIn.listId){
        let tmpList = await this.daoList.getListById(dtoIn.listId);
        if (tmpList.itemList.length === 0){
          return uuAppErrorMap[Errors.Update.ListDoesNotExist.code] = {
            id: dtoIn.id,
            timestamp: (new Date()).toISOString(),
              type: "error",
              message: "List with given id does not exist."
          }
        }
      }else {
        let tmpItem = await this.dao.getItem(dtoIn.id);
        if (tmpItem.itemList.length === 0){
          //return new Errors.Create.ListDoesNotExist({uuAppErrorMap});
          return uuAppErrorMap[Errors.Update.ItemDoesNotExist.code] = {
            id: dtoIn.id,
            timestamp: (new Date()).toISOString(),
              type: "error",
              message: "Item with given id does not exist."
          }
        }
        else{
          if (dtoIn.text){
            dtoOut = await this.dao.updateItemText(dtoIn.id, dtoIn.text);
          }
          if (dtoIn.highPriority){
            dtoOut = await this.dao.updateItemHighPriority(dtoIn.id, dtoIn.highPriority);
          }
          if (dtoIn.ListId){
            dtoOut = await this.dao.updateItemListId(dtoIn.id, dtoIn.listId);
          }
        }
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.ItemDaoUpdateFailed({uuAppErrorMap}, e);
      }
    }

    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
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
