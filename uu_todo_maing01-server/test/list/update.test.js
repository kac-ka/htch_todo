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

  describe("List/update_tests", () => {
    
    test("HDS1", async () =>{
      expect.assertions(6);
      let session = await TestHelper.login("ExecutiveUser");
      let testItem = await TestHelper.executePostCommand("list/create", {
          name: "Test item name",
          description: "Some list for toDo something",
          deadline: "2022-07-16"
      }, session);
      let dtoIn = { 
          id: testItem.data.id,
          name: "Test",
          deadline: "2022-07-21"
      };
      let result = await TestHelper.executePostCommand("list/update", dtoIn , session);
      expect(result.status).toEqual(200);
      expect(result.name).toEqual(dtoIn.name);
      expect(result.description).toEqual("Some list for toDo something");
      expect(result.visibility).toBeTruthy();
      expect(result.deadline).toEqual(dtoIn.deadline);
      expect(result.uuAppErrorMap).toEqual({});
    });
  });