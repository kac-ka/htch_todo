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

  describe("Item/update_tests", () => {
    //expect.assertions(2);
    test("HDS1", async () =>{
        let session = await TestHelper.login("ExecutiveUser");
        let list = await TestHelper.executePostCommand("list/create", {
            name: "Test name 1",
        }, session);
        let dtoInItem = {
            listId: list.id,
            text: "404"            
        };
        let item = await TestHelper.executePostCommand("item/create", dtoInItem , session);
        let dtoIn = {
            id: item.id,
            text: "200",
            highPriority: true
        }
        let result = await TestHelper.executePostCommand("item/update", dtoIn, session);
        expect(result.status).toEqual(200);
        expect(result.text).toEqual(dtoIn.text);
        expect(result.highPriority).toEqual(true);
        expect(result.listId).toEqual(dtoInItem.listId);
        expect(result.visibility).toEqual(true);
        expect(result.state).toEqual("active");
        expect(result.uuAppErrorMap).toEqual({});
    });
  });