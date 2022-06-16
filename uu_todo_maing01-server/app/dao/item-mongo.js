"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {

  async createSchema(){
  }

  async createItem(item) {
    return await super.insertOne(item);
  }

  async getItem(itemId){
    return await super.find({id: `${itemId}`});
  }

  async deleteItemById(itemId){
    return await super.deleteOne({_id: `${itemId}`});
  }

  async updateItemListId(id, listId) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"listId": listId}}, {upsert: true});
  }
  async updateItemText(id, text) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"text": text}}, {upsert: true});
  }
  async updateItemHighPriority(id, highPriority) {
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"highPriority": highPriority}}, {upsert: true});
  }

  async setItemFinalState(id, state){
    return await super.findOneAndUpdate({_id: `${id}`}, {$set : {"state": state}}, {upsert: true});
  }

}

module.exports = ItemMongo;
