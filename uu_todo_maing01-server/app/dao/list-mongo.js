"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({awid: 1, _id: 1}, {unique: true});
    await super.createIndex({ awid: 1, visibility: 1 });
  }

  async createList(list) {
    return await super.insertOne(list);
  }

  async getListById(listId) {
    return await super.find({_id: `${listId}`});
  }

  async updateListName(id, name) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"name": name}}, {upsert: true});
  }

  async updateListDescription(id, description) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"description": description}}, {upsert: true});
  }

  async updateListDeadline(id, deadline) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"deadline": deadline}}, {upsert: true});
  }

  async deleteList(listId) {
    return await super.deleteOne({_id: `${listId}`});
  }

  async listByVisibility(awid, visibility, pageIndex = 0, pageSize = 1000) {
    let pageInfo = {"pageIndex": pageIndex, "pageSize": pageSize};
    //return await super.find({ awid, visibility }, pageInfo, {"name":1});
    return await super.find({visibility},pageInfo);
  }
}

module.exports = ListMongo;
