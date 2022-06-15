"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class ItemController {

  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

}

module.exports = new ItemController();
