"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

}

module.exports = new ListController();
