"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({awid: 1, _id: 1}, {unique: true});
  }

  async createList(list) {
    return await super.insertOne(list);
  }

  async getListById(listId) {
    return await super.find({_id: `${listId}`});
  }
}

module.exports = ListMongo;
