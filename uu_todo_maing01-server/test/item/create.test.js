const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
    await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  });
  
  afterEach(async () => {
    await TestHelper.teardown();
  });

  describe("Item/create_tests", () => {
    //expect.assertions(7);
    test("HDS1", async () =>{
      let listItem = await TestHelper.executePostCommand("list/create", {
          name: "Test name 1",
      }, session);
      let session = await TestHelper.login("ExecutiveUser");
      let dtoIn = {
          listId: listItem.id,
          text: "viiinoo",
          highPriority: true
      };
      let result = await TestHelper.executePostCommand("item/create", dtoIn , session);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual(dtoIn.text);
      expect(result.highPriority).toEqual(dtoIn.highPriority);
      expect(result.listId).toEqual(dtoIn.listId);
      expect(result.visibility).toBeTruthy();
      expect(result.state).toEqual("active");
      expect(result.uuAppErrorMap).toEqual({});
    });
  });