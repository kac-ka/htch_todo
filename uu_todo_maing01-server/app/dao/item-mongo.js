"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({awid: 1, _id: 1}, {unique: true});
    await super.createIndex({ awid: 1, visibility: 1 });
  }

  async createItem(item) {
    return await super.insertOne(item);
  }

  async getItem(awid, itemId){
    return await super.findOne({awid, itemId});
  }

  async deleteItemById(awid, itemId){
    return await super.deleteOne({awid, itemId});
  }
  async deleteManyByListId (awid, listId) {
    return await super.deleteMany({awid, listId});
  }

  async updateItemListId(awid, id, listId) {
    return await super.findOneAndUpdate({awid, id}, {$set : {"listId": listId}}, {upsert: true});
  }
  async updateItemText(awid, id, text) {
    return await super.findOneAndUpdate({awid, id}, {$set : {"text": text}}, {upsert: true});
  }
  async updateItemHighPriority(awid, id, highPriority) {
    return await super.findOneAndUpdate({awid, id}, {$set : {"highPriority": highPriority}}, {upsert: true});
  }

  async setItemFinalState(awid, id, state){
    return await super.findOneAndUpdate({awid, id}, {$set : {"state": state}}, {upsert: true});
  }

  async listItemByListIdAndState(awid, listId, state, pageInfo = { pageIndex: 0, pageSize: 1000 }){
    return await super.find({awid, listId, state}, pageInfo);
  }
  async listItemByListId(awid, listId, pageInfo = { pageIndex: 0, pageSize: 1000 }){
    return await super.find({awid, listId}, pageInfo);
  }
  async listItemByState(awid, state, pageInfo = { pageIndex: 0, pageSize: 1000 }){
    return await super.find({awid, state}, pageInfo);
  }
  async listItemAll(awid, pageInfo = { pageIndex: 0, pageSize: 1000 }){
    return await super.find({awid}, pageInfo);
  }

  async listByListAndState(awid, listId, state) {
    return await super.find({awid, listId, state});
  }
}

module.exports = ItemMongo;
