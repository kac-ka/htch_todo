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
    return await super.find({awid: `${awid}`, id: `${itemId}`});
  }

  async deleteItemById(awid, itemId){
    return await super.deleteOne({awid: `${awid}`, _id: `${itemId}`});
  }

  async updateItemListId(awid, id, listId) {
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"listId": listId}}, {upsert: true});
  }
  async updateItemText(awid, id, text) {
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"text": text}}, {upsert: true});
  }
  async updateItemHighPriority(awid, id, highPriority) {
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"highPriority": highPriority}}, {upsert: true});
  }

  async setItemFinalState(awid, id, state){
    return await super.findOneAndUpdate({awid: `${awid}`, _id: `${id}`}, {$set : {"state": state}}, {upsert: true});
  }

  async listItemByListIdAndState(awid, listId,state){
    return await super.find({awid: `${awid}`, id: `${listId}`, state: `${state}`});
  }
  async listItemByListId(awid, listId){
    return await super.find({awid: `${awid}`, id: `${listId}`, state: `${state}`});
  }
  async listItemByState(awid, state){
    return await super.find({awid: `${awid}`, id: `${listId}`, state: `${state}`});
  }
  async listItemAll(awid){
    return await super.find({awid});
  }

}

module.exports = ItemMongo;
