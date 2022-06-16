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
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
  listDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}listDoesNotExist`,
    message: "List with given id does not exist."
  }
};

const EXECUTIVES_PROFILE = "Authorities";
class ListAbl {

  constructor() {
    this.validator = Validator.load();

    this.dao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
    this.instanceDao = DaoFactory.getDao("todoMain");
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
    let todoInstance = await this.instanceDao.getByAwid(awid);
    if(!todoInstance){ //HDS 2.1.1
      throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    }else {
      if (todoInstance.state !== "active"){ //HDS 2.1.2
        throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
      }
    }

    //HDS 3
    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.listByVisibility(awid, true, dtoIn.pageInfo);
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


    //HDS2
    let todoInstance = await this.instanceDao.getByAwid(awid);
    if(!todoInstance){ //HDS 2.1.1
      throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    }else { //HDS 2.1.2
      if (todoInstance.state !== "active"){
        throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
      }
    }

    //HDS 3
    dtoIn.awid = awid;
    let dtoOut={};
    let tmpList = await this.dao.getListById(awid, dtoIn.id);
    if(!tmpList) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.listDoesNotExist.code,
        WARNINGS.listDoesNotExist.message,
        {id: dtoIn.id}
      );
    }

    //HDS 4
    if(!dtoIn.forceDelete) {
      let tmpList = await this.itemDao.listByListAndState(awid, dtoIn.id, "active");
      if(tmpList.itemList.length > 0) { //HDS 4.1
        throw new Errors.Delete.ListContainsActiveItems(uuAppErrorMap, {id: dtoIn.id, itemList: tmpList.itemList});
      }
    }
    
    try{
      //HDS 5
      await this.itemDao.deleteManyByListId(awid, dtoIn.id);

      //HDS 6
      await this.dao.deleteList(awid, dtoIn.id);
    }catch{
      if (e instanceof ObjectStoreError) {
        throw new Errors.Delete.ListDaoDeleteFailed({uuAppErrorMap}, e);
      }
    throw e;
    }
    
     //HDS 7
     dtoOut.uuAppErrorMap = uuAppErrorMap;
     return dtoOut;
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
    let todoInstance = await this.instanceDao.getByAwid(awid);
    if(!todoInstance){ //HDS 2.1.1
      throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    }else { //HDS 2.1.2
      if (todoInstance.state !== "active"){
        throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
      }
    }

    //HDS 3
    let dateIn = new Date(dtoIn.deadline);
    let dateMilliseconds = dateIn.getTime();
    if(dateMilliseconds < Date.now()) { //HDS 3.1
      throw new Errors.Update.DeadlineDateIsFromThePast(uuAppErrorMap, {deadline: dtoIn.deadline});
    }

    //HDS 4
    dtoIn.awid = awid;
    let dtoOut;
    try { //HDS 4.1
      let tmpList = await this.dao.getListById(awid, dtoIn.id);
      if(!tmpList) {
        throw new Errors.Update.ListDoesNotExist(uuAppErrorMap, {id: dtoIn.id});
      } else { //HDS 4.1.A
        if(dtoIn.name) {
          dtoOut = await this.dao.updateListName(awid, dtoIn.id, dtoIn.name);
        }
        if(dtoIn.description) {
          dtoOut = await this.dao.updateListDescription(awid, dtoIn.id, dtoIn.description);
        }
        if(dtoIn.deadline) {
          dtoOut = await this.dao.updateListDeadline(awid, dtoIn.id, dtoIn.deadline);
        }
      }
    } catch (e) { //HDS 4.1.B
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.ListDaoUpdateFailed(uuAppErrorMap, e);
      }
      throw e;
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
    let todoInstance = await this.instanceDao.getByAwid(awid);
    if(!todoInstance){ //HDS 2.1.1
      throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    }else {
      if (todoInstance.state !== "active"){ //HDS 2.1.2
        throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
      }
    }

    //HDS 3
    let dtoOut;
    dtoIn.awid = awid;
    try {
      dtoOut = await this.dao.getListById(awid, dtoIn.id);
      if(!dtoOut) {
        throw new Errors.Get.ListDoesNotExist({uuAppErrorMap}, {id: dtoIn.id});
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
    let instanceTodo = await this.instanceDao.getByAwid(awid);
    if(!instanceTodo){ //HDS 2.1.1
      throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, {awid: awid});
    }else { //HDS 2.1.2
      if (instanceTodo.state !== "active"){
        throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {awid: awid, currenState: instanceTodo.state, expectedState: "active"})
      }
    }

    //HDS 3
    let dateIn = new Date(dtoIn.deadline);
    let dateMilliseconds = dateIn.getTime();
    if(dateMilliseconds < Date.now()) { //HDS 3.1
      throw new Errors.Create.DeadlineDateIsFromThePast(uuAppErrorMap, {deadline: dtoIn.deadline});
    }

    //HDS 4
    dtoIn.awid = awid;
    let dtoOut;
    try { //HDS 4.1.A
      dtoOut = await this.dao.createList(dtoIn);
    } catch (e) { //HDS 4.1.B
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.ListDaoCreateFailed(uuAppErrorMap, e);
      }
    }

    //HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ListAbl();
