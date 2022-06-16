"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({awid: 1, _id: 1}, {unique: true});
    await super.createIndex({ awid: 1, visibility: 1 });
  }

  async createList(awid, list) {
    return await super.insertOne(awid, list);
  }

  async getListById(awid, listId) {
    return await super.find({awid: `${awid}`, _id: `${listId}`});
  }

  async updateListName(awid, id, name) {
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"name": name}}, {upsert: true});
  }

  async updateListDescription(awid, id, description) {
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"description": description}}, {upsert: true});
  }

  async updateListDeadline(awid, id, deadline) {
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"deadline": deadline}}, {upsert: true});
  }

  async deleteList(awid, listId) {
    return await super.deleteOne({awid: `${awid}`, _id: `${listId}`});
  }

  async listByVisibility(awid, visibility, pageInfo = {pageIndex: 0, pageSize: 1000}) {
    return await super.find({awid, visibility}, pageInfo);
  }

  async listByListAndState(awid, listId, state) {
    return await super.find({awid, listId, state});
  }

  async deleteManyByListId (awid, listId) {
    return await super.deleteMany({awid, listId});
  }
}

module.exports = ListMongo;
