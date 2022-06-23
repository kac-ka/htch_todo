"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({awid: 1, _id: 1}, {unique: true});
    await super.createIndex({ awid: 1 });
  }

  async createList(list) {
    return await super.insertOne(list);
  }

  async getListById(awid, listId) {
    return await super.findOne({awid, listId});
  }

  async updateListName(awid, id, name) {
    return await super.findOneAndUpdate({awid, id}, {$set : {"name": name}}, {upsert: true});
  }

  async updateListDescription(awid, id, description) {
    return await super.findOneAndUpdate({awid, id}, {$set : {"description": description}}, {upsert: true});
  }

  async updateListDeadline(awid, id, deadline) {
    return await super.findOneAndUpdate({awid, id}, {$set : {"deadline": deadline}}, {upsert: true});
  }

  async deleteList(awid, listId) {
    return await super.deleteOne({awid, listId});
  }

  async listByVisibility(awid, pageInfo = {pageIndex: 0, pageSize: 1000}) {
    return await super.find({awid}, pageInfo);
  }

}

module.exports = ListMongo;
