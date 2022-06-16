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

  describe("Item/list_tests", () => {
    //expect.assertions(4);
    test("HDS1", async () =>{
        let session = await TestHelper.login("ExecutiveUser");
        let list = await TestHelper.executePostCommand("list/create", {
            name: "Test name 1",
        }, session);
        await TestHelper.executePostCommand("item/create", {
            listId: list.id,
            text: "item 1"
        } , session);
        await TestHelper.executePostCommand("item/create", {
            listId: list.id,
            text: "item 2"
        } , session);
        await TestHelper.executePostCommand("item/create", {
            listId: list.id,
            text: "item 3"
        } , session);
        let dtoIn = {
            state: "active"
        }
        let result = await TestHelper.executePostCommand("item/list",dtoIn,session);
        expect(result.status).toEqual(200);
        expect(result.itemList[0].state).toEqual("active");
        expect(result.pageInfo.total).toEqual(3);
        expect(result.uuAppErrorMap).toEqual({});
    });
  });