"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {

  async createSchema(){
  }

  async createItem(item) {
    return await super.insertOne(item);
  }

}

module.exports = ItemMongo;
