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

  describe("Item/setFinalState_tests", () => {
    //expect.assertions(7);
    test("HDS1", async () =>{
        let session = await TestHelper.login("ExecutiveUser");
        let list = await TestHelper.executePostCommand("list/create", {
            name: "Test name 1",
        }, session);
        let item = await TestHelper.executePostCommand("item/create", {
            listId: list.id,
            text: "todo item"
        } , session);
        let dtoIn = {
            id: item.id,
            state: "completed"
        }
        let result = await TestHelper.executePostCommand("item/setFinalState", dtoIn, session);
        expect(result.status).toEqual(200);
        expect(result.text).toEqual("todo item");
        expect(result.highPriority).toEqual(false);
        expect(result.listId).toEqual(list.id);
        expect(result.visibility).toEqual(true);
        expect(result.state).toEqual("completed");
        expect(result.uuAppErrorMap).toEqual({});
    });
  });