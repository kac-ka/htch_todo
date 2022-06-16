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
    code: `${Errors.Delete.UC_CODE}itemDoesNotExist`,
    message: "Item with given id does not exist."
  },
  listDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}listDoesNotExist`
  },
  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};
const EXECUTIVES_PROFILE = "Authorities";

class ItemAbl {

  constructor() {
    this.validator = Validator.load();

    this.dao = DaoFactory.getDao("item");
    this.instanceDao = DaoFactory.getDao("todoMain");
    this.daoList = DaoFactory.getDao("list");
  }

  async list(awid, dtoIn, session, authorizationResult) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    //1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn, 
      validationResult,
      WARNINGS.listUnsupportedKeys.code, 
      Errors.List.InvalidDtoIn
      );

    //Authorization
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();

    //HDS 2
    // let todoInstance = await this.instanceDao.getByAwid(awid);
    // if(!todoInstance){ //HDS 2.1.1
    //   throw new Errors.List.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    // }else { //HDS 2.1.2
    //   if (todoInstance.state !== "active"){
    //     throw new Errors.List.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
    //   }
    // }

    //HDS 3
    let dtoOut = {};
    try {
      if (dtoIn.listId && dtoIn.state){ //HDS 3.A
        dtoOut = await this.dao.listItemByListIdAndState(awid, dtoIn.listId, dtoIn.state, dtoIn.pageInfo);
      } else if(dtoIn.listId){
        dtoOut = await this.dao.listItemByListId(awid, dtoIn.listId, dtoIn.pageInfo);
      } else if(dtoIn.state){ //HDS 3.B
        dtoOut = await this.dao.listItemByState(awid, dtoIn.state, dtoIn.pageInfo);
      } else{ //HDS 3.C
        dtoOut = await this.dao.listItemAll(awid, dtoIn.pageInfo);
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.List.ItemDaoListFailed(uuAppErrorMap, e);
      }
    }
    
    //HDS 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
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

    //HDS 2
    // let todoInstance = await this.instanceDao.getByAwid(awid);
    // if(!todoInstance){ //HDS 2.1.1
    //   throw new Errors.SetFinalState.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    // }else { //HDS 2.1.2
    //   if (todoInstance.state !== "active"){
    //     throw new Errors.SetFinalState.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
    //   }
    // }
    
    //HDS 3, 4
    let dtoOut;
    try {
      let tmpItem;
      tmpItem = await this.dao.getItem(awid, dtoIn.id);
      if(!tmpItem) { //HDS 3.1
        throw new Errors.SetFinalState.ItemDoesNotExist(uuAppErrorMap, {id: dtoIn.id});
        } else {
          if (tmpItem.state === "active"){
            dtoOut = await this.dao.setItemFinalState(awid, dtoIn.id, dtoIn.state); 
          } else { //HDS 3.2
            throw new Errors.SetFinalState.ItemIsNotInProperState(
              uuAppErrorMap, 
              {
                id: dtoIn.id,
                state: tmpItem.state,
                expectedState: "active"
              });
          }
        }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
          throw new Errors.SetFinalState.ItemDaoSetFinalStateFailed(uuAppErrorMap, e);
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

    //HDS 2
    // let todoInstance = await this.instanceDao.getByAwid(awid);
    // if(!todoInstance){ //HDS 2.1.1
    //   throw new Errors.Delete.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    // }else { //HDS 2.1.2
    //   if (todoInstance.state !== "active"){
    //     throw new Errors.Delete.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
    //   }
    // }

    //HDS 3
    let dtoOut = {};
    //HDS 3.1
    let tmpItem = await this.dao.getItem(awid, dtoIn.id);
    if(!tmpItem) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.deleteItemDoesNotExist.code,
        WARNINGS.deleteItemDoesNotExist.message,
        {id: dtoIn.id}
      );
    } else { //HDS 3.2
      if(tmpItem.state === "completed") {
        throw new Errors.Delete.ItemIsNotInCorrectState(
          uuAppErrorMap, 
          { 
            id: dtoIn.id,
            currentState: tmpItem.state,
            expectedState: ["active", "cancelled"]
        });
      }
    }

    //HDS 4
    try {
      await this.dao.deleteItemById(awid, dtoIn.id);
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

    //HDS 2
    // let todoInstance = await this.instanceDao.getByAwid(awid);
    // if(!todoInstance){ //HDS 2.1.1
    //   throw new Errors.Update.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    // }else { //HDS 2.1.2
    //   if (todoInstance.state !== "active"){
    //     throw new Errors.Update.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
    //   }
    // }

    //HDS 3
    let tmpItem = await this.dao.getItem(awid,dtoIn.id);
    if (!tmpItem){ //HDS 3.1
      throw new Errors.Update.ItemDoesNotExist(uuAppErrorMap, { id: dtoIn.id});
    } else { //HDS 3.2
      if(tmpItem.state !== "active") {
        throw new Errors.Update.ItemIsNotInCorrectState(
          uuAppErrorMap, 
          { 
            id: dtoIn.id,
            currentState: tmpItem.itemList[0].state,
            expectedState: "active"
          });
      }
    }
        
    //HDS 4
    let dtoOut;
    if (dtoIn.listId) {
      let tmpList = await this.daoList.getListById(awid, dtoIn.listId);
      if (!tmpList){ //HDS 4.1
        throw new Errors.Update.ListDoesNotExist(uuAppErrorMap, {id: dtoIn.listId});
      }
    }  
          
    //HDS 5
    try { //HDS 5.1.A
      if (dtoIn.text){
        dtoOut = await this.dao.updateItemText(awid, dtoIn.id, dtoIn.text);
      }
      if (dtoIn.highPriority){
        dtoOut = await this.dao.updateItemHighPriority(awid, dtoIn.id, dtoIn.highPriority);
      }
      if (dtoIn.ListId){
        dtoOut = await this.dao.updateItemListId(awid, dtoIn.id, dtoIn.listId);
      }        
    } catch (e) { //HDS 5.1.B
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.ItemDaoUpdateFailed({uuAppErrorMap}, e);
      }
      throw e;
    }

    //HDS 6
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
    
    //HDS 2
    // let todoInstance = await this.instanceDao.getByAwid(awid);
    // if(!todoInstance){ //HDS 2.1.1
    //   throw new Errors.Get.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    // }else { //HDS 2.1.2
    //   if (todoInstance.state !== "active"){
    //     throw new Errors.Get.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
    //   }
    // }

    //HDS 3
    let dtoOut;
      dtoOut = await this.dao.getItem(awid, dtoIn.id);
      if (!dtoOut){ //HDS 3.1
        throw new Errors.Get.ItemDoesNotExist(uuAppErrorMap, {id: dtoIn.id});
      }
    
    //HDS 4
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

    //HDS 2
    // let todoInstance = await this.instanceDao.getByAwid(awid);
    // if(!todoInstance){ //HDS 2.1.1
    //   throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    // }else { //HDS 2.1.2
    //   if (todoInstance.state !== "active"){
    //     throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
    //   }
    // }

    //HDS 3
    dtoIn.state = "active";

    //HDS 4, 5
    dtoIn.awid = awid;
    let dtoOut;
    try {
      let tmpList = await this.daoList.getListById(awid, dtoIn.listId);
      if (!tmpList){ //HDS 4.1
        throw new Errors.Create.ListDoesNotExist(uuAppErrorMap, {id: dtoIn.listId});
      }
      else{
        dtoOut = await this.dao.createItem(dtoIn)
      }
    } catch (e) { //HDS 5.1.B.1
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.ItemDaoCreateFailed(uuAppErrorMap, e);
      }
      throw e;
    }

    //HDS 6
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

}

module.exports = new ItemAbl();
