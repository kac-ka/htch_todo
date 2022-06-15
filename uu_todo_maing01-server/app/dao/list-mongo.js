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

  async updateListName(id, name) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"name": name}}, {upsert: true});
  }

  async updateListDescription(id, description) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"description": description}}, {upsert: true});
  }

  async updateListDeadline(id, deadline) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"deadline": deadline}}, {upsert: true});
  }
}

module.exports = ListMongo;
